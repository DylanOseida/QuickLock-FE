import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from "../components/quicklock/accordion";
import BottomNav from "../components/quicklock/bottom-nav";
import { getUserInfo } from "../config/api";


export default function Settings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

  return (
    <LinearGradient
      colors={["#0E1927", "#1D3047"]}
      style={StyleSheet.absoluteFillObject}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View />
            <Pressable style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Feather name="user" size={24} color="#cfe7f5" />
              </View>
            </Pressable>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.body}>

          {/* Account Settings */}

          <Accordion
            title="Account Settings"
            variant="link"
            onPress={handleUserDetails}
          />

          {/* Device Settings */}

          <Accordion
            title="Device Settings"
            variant="link"
            onPress={() => router.push("/devices")}
          />

          {/* Notifications */}
          <Accordion title="Notifications" variant="toggle"/>

        </View>

        {/* Bottom Nav */}
        <BottomNav active="settings" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "3%",
    paddingHorizontal: "6%",
    alignItems: "center",
    opacity: 0,
    pointerEvents: "none",
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
    alignItems: "center",
    marginTop: "3%",
    marginBottom: "8%",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: "800",
  },
  body: {
    flex: 1,
    paddingHorizontal: "7%",
    gap: 20,
  },
  card: {
    height: 65,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardText: {
    color: "#E9F4FF",
    fontSize: 18,
    fontWeight: "600",
  },
});
