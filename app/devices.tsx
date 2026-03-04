import { Feather } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
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

export default function Devices() {
  const router = useRouter();

  const devices = [
    { id: "261361", label: "Lock 1", name: "Front Door" },
    { id: "323101", label: "Lock 2", name: "Back Door" },
    { id: "895722", label: "Lock 3", name: "Garage Door" },
  ];

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {devices.map((device, index) => (
              <View key={index} style={styles.deviceBlock}>
                {/* Lock Header Row */}
                <View style={styles.deviceHeader}>
                  <View>
                    <Text style={styles.lockTitle}>{device.label}</Text>
                    <Text style={styles.lockId}>ID #{device.id}</Text>
                  </View>

                  <Pressable>
                    <Feather name="trash-2" size={22} color="#E9F4FF" />
                  </Pressable>
                </View>

                {/* Name Field */}
                <View style={styles.inputContainer}>
                  <TextInput
                    value={device.name}
                    editable={false}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    style={styles.input}
                  />
                </View>
              </View>
            ))}

            {/* Add Device Button */}
            <Pressable style={styles.addButton}>
              <Feather name="plus-square" size={20} color="#E9F4FF" />
              <Text style={styles.addButtonText}>Add Device</Text>
            </Pressable>
          </ScrollView>
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
    marginTop: 30,
    height: 55,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  addButtonText: {
    color: "#E9F4FF",
    fontSize: 18,
    fontWeight: "600",
  },
});
