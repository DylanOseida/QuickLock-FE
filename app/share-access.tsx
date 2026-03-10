import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../assets/styles/colors";
import Variables from "../assets/styles/variables";
import Accordion from "../components/quicklock/accordion";
import BottomNav from "../components/quicklock/bottom-nav";
import DateTime from "../components/quicklock/date-time";
import { generateKey, getUserInfo } from "../config/api";

// Single lock for now
const LOCKS = [{ id: "1", lockLabel: "Front Door" }];

export default function ShareAccess() {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [keyName, setKeyName] = useState("");
  const [startValue, setStartValue] = useState<Date>(midnight);
  const [endValue, setEndValue] = useState<Date | null>(null); // null = “no end date” unless checked
  const [endEnabled, setEndEnabled] = useState(false);

  // keep array for future multi-lock support
  const [selectedLocks, setSelectedLocks] = useState<string[]>([]);

  function LockRow({ id, lockLabel }: { id: string; lockLabel: string }) {
    const isSelected = selectedLocks.includes(id);

    const toggleLock = () => {
      setSelectedLocks((prev) =>
        prev.includes(id)
          ? prev.filter((lockId) => lockId !== id)
          : [...prev, id],
      );
    };

    return (
      <View style={row.row}>
        <Text style={row.name}>{lockLabel}</Text>

        <Switch
          value={isSelected}
          onValueChange={toggleLock}
          trackColor={{
            false: "rgba(233,244,255,0.22)",
            true: "rgba(207,231,245,0.45)",
          }}
          thumbColor="rgba(233,244,255,0.95)"
        />
      </View>
    );
  }

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

  const handleAssignKey = async () => {
    try {
      if (!email.trim() || !keyName.trim()) {
        console.warn("Missing email or key name");
        return;
      }

      if (selectedLocks.length === 0) {
        console.warn("No lock selected");
        return;
      }

      const lock_id = selectedLocks[0];

      const not_valid_before = dayjs(startValue).format("YYYY-MM-DD HH:mm:ss");

      const not_valid_after =
        endEnabled && endValue
          ? dayjs(endValue).format("YYYY-MM-DD HH:mm:ss")
          : null;

      if (
        not_valid_after &&
        dayjs(not_valid_after).isBefore(dayjs(not_valid_before))
      ) {
        console.warn("End date/time must be after start date/time");
        return;
      }

      const payload = {
        administrator: 65,
        user_email: email.trim(),
        key_name: keyName.trim(),
        not_valid_before,
        not_valid_after,
        lock_id,
      };

      const res = await generateKey(payload);
      console.log("generateKey success:", res);

      router.back();
    } catch (err: any) {
      console.error(
        "generateKey failed:",
        err?.status,
        err?.payload || err?.message,
      );
    }
  };

  return (
    <LinearGradient
      colors={["#0E1927", "#1D3047"]}
      style={StyleSheet.absoluteFillObject}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.backContainer}>
            <Pressable
              style={styles.avatar}
              onPress={() => {
                if (router.canGoBack()) router.back();
              }}
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                size={24}
                color="white"
              />
            </Pressable>
          </View>
          <View style={styles.avatarContainer}>
            <Pressable style={styles.avatar} onPress={handleUserDetails}>
              <Feather name="user" size={24} color="#cfe7f5" />
            </Pressable>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>New User</Text>
        </View>

        <View style={styles.body}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollStyle}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>Key Name</Text>
            </View>
            <View style={styles.inputStyle}>
              <MaterialCommunityIcons
                style={[styles.icon, { transform: [{ rotate: "90deg" }] }]}
                name="key"
                size={24}
              />
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={Colors.placeholder}
                value={keyName}
                onChangeText={setKeyName}
                autoCapitalize="none"
                editable
              />
            </View>

            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>Enter User Email</Text>
            </View>
            <View style={styles.inputStyle}>
              <MaterialIcons style={styles.icon} name="email" size={24} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={Colors.placeholder}
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
                autoCapitalize="none"
                editable
              />
            </View>

            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>Access Type</Text>
            </View>

            <Accordion title="Permanent Access" variant="toggle">
              <DateTime />
            </Accordion>

            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>Lock Permissions</Text>
            </View>

            <Accordion title="Locks" defaultOpen alwaysOpen>
              {LOCKS.map((u) => (
                <LockRow key={u.id} id={u.id} lockLabel={u.lockLabel} />
              ))}
            </Accordion>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.shareBtn} onPress={handleAssignKey}>
            <Text style={styles.shareBtnText}>Assign New Key</Text>
          </Pressable>
        </View>

        <BottomNav active="users" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "3%",
    paddingHorizontal: "6%",
    alignItems: "center",
  },
  backContainer: {
    width: "auto",
  },
  avatarContainer: {
    width: "auto",
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
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: "800",
  },
  body: {
    flex: 1,
    paddingBottom: "5%",
    paddingHorizontal: "7%",
  },
  scrollStyle: {
    paddingBottom: "20%",
    gap: 15,
  },
  subTitleContainer: {
    width: "100%",
    marginTop: "8%",
  },
  subTitle: {
    color: "#E9F4FF",
    fontSize: 25,
  },
  inputStyle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 5,
    borderColor: "white",
    backgroundColor: Colors.text_input,
  },
  icon: {
    marginLeft: 5,
    marginRight: 5,
    color: Colors.placeholder,
  },
  input: {
    ...Variables.input,
    textAlignVertical: "center",
  },
  footer: {
    height: "auto",
    width: "100%",
    paddingHorizontal: "7%",
    marginBottom: "5%",
    justifyContent: "center",
    alignContent: "center",
  },
  shareBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  shareBtnText: {
    color: "#E9F4FF",
    fontSize: 16,
    fontWeight: "700",
  },
});

const row = StyleSheet.create({
  row: {
    width: "100%",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#E9F4FF",
    fontSize: 16,
  },
});
