import { Feather } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
          <Pressable style={styles.avatarContainer} onPress={handleUserDetails}>
            <View style={styles.avatar}>
              <Feather name="user" size={24} color="#cfe7f5" />
            </View>
          </Pressable>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.body}>
          <Pressable
            style={styles.card}
            onPress={() => router.push("/account")}
          >
            <Text style={styles.cardText}>Account Settings</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="rgba(233,244,255,0.8)"
            />
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/devices")}
          >
            <Text style={styles.cardText}>Manage Devices</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="rgba(233,244,255,0.8)"
            />
          </Pressable>

          {/* Notifications */}
          <View style={styles.card}>
            <Text style={styles.cardText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: "rgba(255,255,255,0.2)",
                true: "#4DA3FF",
              }}
              thumbColor="#ffffff"
            />
          </View>
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
