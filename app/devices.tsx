import { Feather } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/quicklock/bottom-nav";
import { fetchAdminLocks, getUserInfo } from "../config/api";

type Lock = {
  lock_id: number;
  name: string;
  location: string | null;
  is_active: boolean | null;
  created_at: string;
  status: boolean;
  administrator: number;
};

export default function Devices() {
  const router = useRouter();

  const [devices, setDevices] = useState<Lock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLocks = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = await getUserInfo();
      const isAdmin =
        currentUser?.admin === true || currentUser?.is_admin === true;

      if (!isAdmin) {
        setDevices([]);
        setError("Administrator access is required to view devices.");
        return;
      }

      const data = await fetchAdminLocks();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading locks:", err);
      setDevices([]);
      setError("Unable to verify device access.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocks();
  }, []);

  return (
    <LinearGradient
      colors={["#0E1927", "#1D3047"]}
      style={StyleSheet.absoluteFillObject}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backContainer}
            onPress={() => {
              if (router.canGoBack()) router.back();
            }}
          >
            <MaterialIcons name="arrow-back-ios-new" size={24} color="white" />
          </Pressable>
          <View style={{ width: 24 }} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Devices</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color="#E9F4FF" />
              <Text style={styles.stateText}>Loading devices...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerState}>
              <Text style={styles.stateText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={loadLocks}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {devices.length === 0 ? (
                <View style={styles.centerState}>
                  <Text style={styles.stateText}>No devices found.</Text>
                </View>
              ) : (
                devices.map((device, index) => (
                  <View key={device.lock_id} style={styles.deviceBlock}>
                    {/* Lock Header Row */}
                    <View style={styles.deviceHeader}>
                      <View>
                        <Text style={styles.lockTitle}>{`Lock ${index + 1}`}</Text>
                        <Text style={styles.lockId}>{`ID #${device.lock_id}`}</Text>
                      </View>

                      <Pressable>
                        <Feather name="trash-2" size={22} color="#E9F4FF" />
                      </Pressable>
                    </View>

                    {/* Name Field */}
                    <View style={styles.inputContainer}>
                      <TextInput
                        value="Front Door"
                        editable={false}
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        style={styles.input}
                      />
                    </View>
                  </View>
                ))
              )}

              {/* Add Device Button */}
              <Pressable style={styles.addButton}>
                <Feather name="plus-square" size={20} color="#E9F4FF" />
                <Text style={styles.addButtonText}>Add Device</Text>
              </Pressable>
            </ScrollView>
          )}
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
  backContainer: {
    width: "auto",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "6%",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: "800",
  },
  body: {
    flex: 1,
    paddingHorizontal: "7%",
  },
  deviceBlock: {
    marginBottom: 28,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lockTitle: {
    color: "#E9F4FF",
    fontSize: 26,
    fontWeight: "700",
  },
  lockId: {
    color: "rgba(233,244,255,0.6)",
    fontSize: 14,
    marginTop: 4,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  input: {
    color: "#E9F4FF",
    fontSize: 18,
  },
  addButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  addButtonText: {
    color: "#E9F4FF", 
    fontSize: 16,
    fontWeight: "700" 
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  stateText: {
    color: "#E9F4FF",
    fontSize: 18,
    marginTop: 14,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  retryButtonText: {
    color: "#E9F4FF",
    fontSize: 16,
    fontWeight: "600",
  },
});