import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CARD_WIDTH = 0.86; // percentage of screen width (used in styles)

export default function App() {
  const [locked, setLocked] = useState(false);
  const [battery] = useState(79);
  const holdAnim = useRef(new Animated.Value(0)).current;

  const lockIcon = useMemo<keyof typeof Feather.glyphMap>(
    () => (locked ? "lock" : "unlock"),
    [locked]
  );

  const ctaText = locked ? "Hold to Unlock" : "Hold to Lock";
  const statusText = `${locked ? "Locked" : "Unlocked"} by John Doe`;
  const timeText = "Today at 10:28 AM";

const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

const onPressIn = () => {
  Animated.timing(holdAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: false,
  }).start();

  holdTimer.current = setTimeout(() => {
    setLocked(v => !v);

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    Animated.sequence([
      Animated.timing(holdAnim, { toValue: 0, duration: 0, useNativeDriver: false }),
      Animated.timing(holdAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(holdAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  }, 1000);
};

const onPressOut = () => {
  if (holdTimer.current) {
    clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }
  Animated.timing(holdAnim, {
    toValue: 0,
    duration: 180,
    useNativeDriver: false,
  }).start();
};

  const ringBorderWidth = holdAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 10],
  });

  const ringOpacity = holdAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.7],
  });

  return (
    <LinearGradient
      colors={["#1A2430", "#1B4764"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <View style={styles.avatar}>
            <Feather name="user" size={24} color="#cfe7f5" />
          </View>
        </View>

        {/* Card */}
        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Front Door</Text>
            <Text style={styles.muted}>Battery Life: {battery}%</Text>

            {/* Lock button */}
            <View style={{ height: 320, alignItems: "center", justifyContent: "center" }}>
              <Animated.View
                style={[
                  styles.ring,
                  { borderWidth: ringBorderWidth as any, opacity: ringOpacity as any },
                ]}
              />
              <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: true }}
                style={({ pressed }) => [
                  styles.lockButton,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
              >
                <Feather
                  name={lockIcon}
                  size={125}
                  color={locked ? "#e2e8f0" : "#e2e8f0"}
                />
              </Pressable>
            </View>

            <Text style={styles.cta}>{ctaText}</Text>

            <View style={{ height: 28 }} />

            <Text style={styles.status}>{statusText}</Text>
            <Text style={styles.time}>{timeText}</Text>

            {/* Pager dots */}
            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        {/* Bottom nav */}
        <View style={styles.navBar}>
          <NavItem icon="home" active />
          <NavItem icon="users" />
          <NavItem icon="file-text" />
          <NavItem icon="settings" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function NavItem({
  icon,
  active,
}: {
  icon: keyof typeof Feather.glyphMap;
  active?: boolean;
}) {
  return (
    <View style={styles.navItem}>
      <Feather
        name={icon}
        size={28}
        color={active ? "#E5F3FF" : "rgba(229,243,255,0.65)"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 8 : 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "800",
    letterSpacing: 0.4,
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

  cardWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 26,
    paddingVertical: 26,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
  },
  cardTitle: {
    color: "#E9F4FF",
    fontSize: 38,
    fontWeight: "800",
    marginBottom: 8,
    textAlign:"center",
  },
  muted: {
    color: "rgba(233,244,255,0.85)",
    fontSize: 18,
    marginBottom: 8,
    textAlign:"center",
  },

  lockButton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderColor: "rgba(255,255,255,0.25)",
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderColor: "rgba(255,255,255,0.5)",
  },

  cta: {
    textAlign: "center",
    color: "#E9F4FF",
    fontSize: 26,
    fontWeight: "700",
  },
  status: {
    textAlign: "center",
    color: "#CFE7F5",
    fontSize: 20,
    marginTop: 6,
  },
  time: {
    textAlign: "center",
    color: "rgba(207,231,245,0.85)",
    fontSize: 14,
    marginTop: 4,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
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

  navBar: {
    marginHorizontal: 16,
    marginBottom: 18,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 28,
    paddingHorizontal: 22,
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  navItem: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
  },
});
