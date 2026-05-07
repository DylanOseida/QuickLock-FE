import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/quicklock/bottom-nav";
import { fetchAdminActivityLogs, fetchUserActivityLogs, getUserInfo } from "../config/api";

dayjs.extend(utc);
dayjs.extend(timezone);

type ActivityLogRecord = {
  attempt_id: number;
  presented_credential: string | null;
  reason: string | null;
  attempted_at: string;
  permission: string;
  result: boolean;
  user: number | null;
  username?: string | null;
  lock: number;
  location: string;
  key: number | null;
};

const PACIFIC_TIME_ZONE = "America/Los_Angeles";

export default function ActivityLog() {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentUser = await getUserInfo();

        const isAdmin =
          currentUser?.is_staff === true ||
          currentUser?.admin === true ||
          currentUser?.is_admin === true;

        const data = isAdmin
          ? await fetchAdminActivityLogs()
          : await fetchUserActivityLogs();
          
        const sortedLogs = [...data].sort((a, b) => {
          const aTime = new Date(a.attempted_at).getTime();
          const bTime = new Date(b.attempted_at).getTime();
          return bTime - aTime;
        });

        if (mounted) {
          setLogs(sortedLogs);
        }
      } catch (err: any) {
        console.error("Error fetching activity logs:", err);

        if (mounted) {
          setError("We couldn't load your activity right now.");
          setLogs([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      mounted = false;
    };
  }, []);

  const handleUserDetails = async () => {
    try {
      const userDetails = await getUserInfo();
      router.push({
        pathname: "/account",
        params: { userDetails: JSON.stringify(userDetails) },
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getFormattedTimestamp = (value: string) => {
  if (!value) {
    return {
      date: "Unknown date",
      time: "",
    };
  }

  const parsed = dayjs.utc(value).tz(PACIFIC_TIME_ZONE);

    if (!parsed.isValid()) {
      return {
        date: "Unknown date",
        time: "",
      };
    }

    return {
      date: parsed.format("M/D/YYYY"),
      time: parsed.format("h:mm A"),
    };
  };

  const getAttemptSource = (log: ActivityLogRecord) => {
    const credential = log.presented_credential?.trim().toLowerCase();

    if (credential === "card") {
      return "credit-card";
    }

    return "mobile";
  };
  
  const getUsername = (log: ActivityLogRecord) => {
    return log.username?.trim() || "Unknown user";
  };

  const isFailedAttempt = (log: ActivityLogRecord) => {
    const permissionText = (log.permission || "").toLowerCase();

    if (
      permissionText.includes("denied") ||
      permissionText.includes("failed") ||
      permissionText.includes("rejected")
    ) {
      return true;
    }

    return Boolean(log.reason?.trim()) && !permissionText.includes("granted");
  };

  const getLogTitle = (log: ActivityLogRecord) => {
    
    const username = getUsername(log);

    if (isFailedAttempt(log)) {
      return `${username} attempted access but failed`;
    }

    return `${log.result ? "Locked" : "Unlocked"} by ${username}`;
  };

const getLogSubtitle = (log: ActivityLogRecord) => {
  const location =
    log.location?.toLowerCase() === "main"
      ? "Front Door"
      : log.location || "Unknown location";

  const parts = [location];

  if (isFailedAttempt(log) && log.reason?.trim()) {
    parts.push(log.reason.trim());
  }

  return parts.join(" | ");
};

  return (
    <LinearGradient
      colors={["#0E1927", "#1D3047"]}
      style={StyleSheet.absoluteFillObject}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable style={styles.avatarContainer} onPress={handleUserDetails}>
            <View style={styles.avatar}>
              <Feather name="user" size={24} color="#cfe7f5" />
            </View>
          </Pressable>
          <Text style={styles.title}>Activity Log</Text>
        </View>

        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>History</Text>

            {loading ? (
              <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>Loading activity...</Text>
              </View>
            ) : error ? (
              <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>{error}</Text>
              </View>
            ) : logs.length === 0 ? (
              <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>No activity found.</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {logs.map((log) => { 
                  const timestamp = getFormattedTimestamp(log.attempted_at);
                  
                  return(
                  <View key={log.attempt_id} style={styles.log}>
                    <View style={styles.doorAccessedIcon}>
                      <AntDesign name={getAttemptSource(log)} size={24} color="white" />
                    </View>

                    <View style={styles.doorDetails}>
                      <Text style={styles.doorAccessed}>
                        {getLogTitle(log)}
                      </Text>
                      <Text style={styles.lock}>{getLogSubtitle(log)}</Text>
                    </View>

                    <View style={styles.timeStamp}>
                      <Text style={styles.date}>{timestamp.date}</Text>
                      <Text style={styles.time}>{timestamp.time}</Text>
                    </View>
                  </View>
                )})}
              </ScrollView>
            )}
          </View>
        </View>

        <BottomNav active="file-text" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "column",
    paddingHorizontal: "6%",
    marginTop: "3%",
    marginBottom: "3%",
    alignItems: "center",
  },
  avatarContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: "800",
  },
  cardWrap: {
    flex: 1,
    paddingHorizontal: "7%",
    paddingBottom: "5%",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    paddingVertical: "5%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
  },
  cardTitle: {
    color: "#E9F4FF",
    fontSize: 38,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
  },
  scrollArea: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: "7.5%",
  },
  stateContainer: {
    flex: 1,
    paddingHorizontal: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  stateTitle: {
    color: "#E9F4FF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  log: {
    width: "100%",
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
    paddingVertical: 10,
  },
  doorAccessedIcon: {
    width: 40,
    alignItems: "center",
  },
  doorDetails: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 1,
    flexDirection: "column",
    gap: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  doorAccessed: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
  lock: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "400",
  },
  timeStamp: {
    minWidth: 55,
    flexDirection: "column",
    gap: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  date: {
    color: "white",
    fontSize: 12,
    fontWeight: "400",
  },
  time: {
    color: "white",
    fontSize: 12,
    fontWeight: "400",
  },
  history: {
    textAlign: "center",
    color: "#CFE7F5",
    fontSize: 20,
  },
});
