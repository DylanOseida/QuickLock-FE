import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/quicklock/bottom-nav";
import { fetchLatestSuccessfulLog, fetchLocks, fetchLockStatus, getStoredLockId, getUserInfo, toggleLock } from '../config/api';

dayjs.extend(utc);
dayjs.extend(timezone);


const CARD_WIDTH = 0.86;
const STATUS_RETRY_DELAY_MS = 500;
const STATUS_RETRY_LIMIT = 8;

type LatestLog = {
  attempted_at: string;
  result: boolean;
  username?: string | null;
};

const PACIFIC_TIME_ZONE = "America/Los_Angeles";

export default function Home() {
  const [locked, setLocked] = useState(false);
  const [battery] = useState(79);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const holdAnim = useRef(new Animated.Value(0)).current;
  const holdTimer = useRef<number | null>(null);
  const router = useRouter();
  const [latestLog, setLatestLog] = useState<LatestLog | null>(null);
  // const [lockId, setLockId] = useState<string | null>(null);   might need this later
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [locks, setLocks] = useState<any[] | null>(null);

  const refreshLockStatus = async () => {
    const status = await fetchLockStatus();

    if (typeof status === "boolean") {
      setLocked(status);
      return status;
    }

    const id = await getStoredLockId();
    setLocks(id ? [id] : []);
    return null;
  };

  const refreshLatestLog = async () => {
  try {
    const log = await fetchLatestSuccessfulLog();
    setLatestLog(log);
    return log;
  } catch (err) {
    console.error("Failed to refresh latest log:", err);
    setLatestLog(null);
    return null;
  }
};

  useEffect(() => {
    let mounted = true;

    const refreshLockStatus = async () => {
      const status = await fetchLockStatus();
      if (!mounted) return null;

      if (typeof status === "boolean") {
        setLocks([1]);
        setLocked(status);
        return status;
      }

      const id = await getStoredLockId();
      if (!mounted) return null;

      setLocks(id ? [1] : []);
      return null;
    };

    const getLocks = async () => {
      try {
        setIsLoadingStatus(true);

        // Clear any previous interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // 🔹 Check if a lockId is stored (this tells us if user has access)
        const id = await getStoredLockId();
        console.log("HOME stored lockId:", id);   

        if (!mounted) return;

        if (!id) {
          // No stored lock → user has no access
          setLocks([]); // use empty array to show "No lock access"
          return;
        }

        // User has access (we don't care about the full lock list anymore)
        setLocks([id]); // just something non-empty
        await checkForNewAccess();

        // 🔹 Fetch initial lock status
        const status = await refreshLockStatus();
        await refreshLatestLog();

        if (!mounted) return;

        if (typeof status !== "boolean") {
          return;
        }

        // 🔹 Start polling status
        intervalRef.current = setInterval(async () => {
          await refreshLockStatus();
        }, 3000);

      } catch (e) {
        console.error("Home start failed:", e);
        if (mounted) setLocks([]);
      } finally {
        if (mounted) {
          setIsLoadingStatus(false);
        }
      }
    };

    getLocks();

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const lockIcon = useMemo(() => (locked ? "lock" : "unlock"), [locked]);
  const ctaText = locked ? "Hold to Unlock" : "Hold to Lock";
  const statusText = latestLog
    ? `${latestLog.result ? "Locked" : "Unlocked"} by ${
        latestLog.username?.trim() || "Unknown user"
      }`
    : locked
      ? "Locked"
      : "Unlocked";

  const timeText = latestLog?.attempted_at
    ? dayjs.utc(latestLog.attempted_at).tz(PACIFIC_TIME_ZONE).format("M/D/YYYY [at] h:mm A")
    : "";

  const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  const waitForLockStatusChange = async (previousStatus: boolean) => {
    for (let attempt = 0; attempt < STATUS_RETRY_LIMIT; attempt += 1) {
      await wait(STATUS_RETRY_DELAY_MS);

      const refreshedStatus = await refreshLockStatus();

      if (
        typeof refreshedStatus === "boolean" &&
        refreshedStatus !== previousStatus
      ) {
        return refreshedStatus;
      }
    }

    return null;
  };

  const onPressIn = () => {
    Animated.timing(holdAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    holdTimer.current = setTimeout(() => {
      (async () => {
        try {
          setIsUpdatingStatus(true);

          const previousStatus = locked;

          await toggleLock();

          const confirmedStatus = await waitForLockStatusChange(previousStatus);

          if (typeof confirmedStatus === "boolean") {
            setLocked(confirmedStatus);
          } else {
            const fallbackStatus = await refreshLockStatus();
            if (typeof fallbackStatus === "boolean") {
              setLocked(fallbackStatus);
            }
          }
        } catch (error) {
          console.error("Error updating lock status:", error);
        } finally {
          setIsUpdatingStatus(false);
          await refreshLatestLog();
        }
      })();

      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }

      Animated.sequence([
        Animated.timing(holdAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(holdAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(holdAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }, 1000);
  };

  const onPressOut = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    Animated.timing(holdAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  };

  const ringBorderWidth = holdAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 10] });
  const ringOpacity = holdAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.7] });

  const handleUserDetails = async () => {
    try {
      const userDetails = await getUserInfo();
      console.log("Last login:", userDetails.last_login);
      router.push({
        pathname: "/account",
        params: { userDetails: JSON.stringify(userDetails) },
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const checkForNewAccess = async () => {
    try {
      const userInfo = await getUserInfo();
      const lastLogin = userInfo?.last_login;

      if (!lastLogin) return;

      const locks = await fetchLocks();

      if (!Array.isArray(locks) || locks.length === 0) return;

      const lastLoginTime = new Date(lastLogin).getTime();

      const newLocks = locks.filter((lock) => {
        if (!lock?.created_at) return false;

        const createdTime = new Date(lock.created_at).getTime();
        return createdTime > lastLoginTime;
      });

      if (newLocks.length > 0) {
        const names = newLocks
          .map((l) => l.name || `Lock #${l.lock_id}`)
          .join(", ");

        Alert.alert(
          "New Access Granted",
          `You now have access to: ${names}`
        );
      }
    } catch (err) {
      console.error("checkForNewAccess error:", err);
    }
  };


  return (
    <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Pressable style={styles.avatar} onPress ={handleUserDetails}><Feather name="user" size={24} color="#cfe7f5" /></Pressable>
          </View>
          <Text style={styles.title}>Home</Text>
        </View>

        {/* Card */}
        <View style={styles.cardWrap}>
         <View style={styles.card}>
          {isLoadingStatus ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color="#E9F4FF" />
              <Text style={styles.loadingTitle}>Loading lock status...</Text>
            </View>
          ) : !locks || locks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No lock access</Text>
              <Text style={styles.emptySubtitle}>
                You don’t have access to any locks right now. Ask an admin to add you to a lock.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.cardTitle}>Front Door</Text>
              <Text style={styles.muted}>Battery Life: {battery}%</Text>

              <View style={styles.lockButtonContainer}>
                <Animated.View
                  style={[styles.ring, { borderWidth: ringBorderWidth, opacity: ringOpacity }]}
                />

                {isUpdatingStatus ? (
                  <View style={styles.lockButton}>
                    <ActivityIndicator size="large" color="#E9F4FF" />
                  </View>
                ) : (
                  <Pressable
                    disabled={isUpdatingStatus}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: true }}
                    style={({ pressed }) => [
                      styles.lockButton,
                      pressed && { transform: [{ scale: 0.98 }] },
                    ]}
                  >
                    <Feather name={lockIcon} size={125} color="#e2e8f0" />
                  </Pressable>
                )}
              </View>

              <Text style={styles.cta}>
                {isUpdatingStatus ? "Updating lock status..." : ctaText}
              </Text>

              <View style={styles.status}>
                <Text style={styles.history}>{statusText}</Text>
                <Text style={styles.time}>{timeText}</Text>
              </View>

              <View style={styles.dotContainer}>
                <View style={styles.dotsRow}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
            </>
          )}
        </View>
      </View>

        {/* Bottom nav */}
        <BottomNav active="home"/>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  /*HEADER*/
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
  emptyState: {
    flex: 1,
    paddingHorizontal: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingState: {
    flex: 1,
    paddingHorizontal: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingTitle: {
    marginTop: 20,
    color: "#E9F4FF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  loadingSubtitle: {
    marginTop: 10,
    color: "rgba(233,244,255,0.80)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyTitle: {
    color: "#E9F4FF",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 10,
    color: "rgba(233,244,255,0.80)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  cardTitle: {
    color: "#E9F4FF",
    fontSize: 38,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
  },
  muted: {
    color: "rgba(233,244,255,0.85)",
    fontSize: 18,
    textAlign: "center",
  },
  lockButtonContainer: {
    height: 250,
    marginTop: "5%",
    alignItems: "center",
    justifyContent: "center",
  },
  lockButton: {
    width: 200,
    height: 200,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderColor: "rgba(255,255,255,0.25)",
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 140,
    borderColor: "rgba(255,255,255,0.5)",
  },
  cta: {
    textAlign: "center",
    marginTop: "5%",
    color: "#E9F4FF",
    fontSize: 26,
    fontWeight: "700",
  },
  status: {
    flex: 1,
    justifyContent: "center",
  },
  history: {
    textAlign: "center",
    color: "#CFE7F5",
    fontSize: 20,
  },
  time: {
    textAlign: "center",
    color: "rgba(207,231,245,0.85)",
    fontSize: 14,
    marginTop: 4,
  },
  dotContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: {
    backgroundColor: "rgba(255,255,255,0.8)",
  },

});
