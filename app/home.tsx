import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/quicklock/bottom-nav";
import { sendLockState } from '../config/api';

const CARD_WIDTH = 0.86; 


export default function App() {
  const [locked, setLocked] = useState(false);
  const [battery] = useState(79);
  const [nfcUID, setNfcUID] = useState("");
  const [nfcAuthorized, setNfcAuthorized] = useState(false);

  const holdAnim = useRef(new Animated.Value(0)).current;
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  // const interval = setInterval(async () => {
  //   const status = await fetchNFCStatus();
  //   setNfcUID(status.uid || "");
  //   setNfcAuthorized(status.authorized || false);

  //   setLocked(!status.authorized ? true : false); 
  // }, 1000);

  // return () => clearInterval(interval);
}, []);

  const lockIcon = useMemo(() => (locked ? "lock" : "unlock"), [locked]);
  const ctaText = locked ? "Hold to Unlock" : "Hold to Lock";
const statusText = locked ? "Locked by John Doe"
    : "Unlocked by John Doe";
  const timeText = "Today at 10:28 AM";

  // Lock button handlers
  const onPressIn = () => {
    Animated.timing(holdAnim, { toValue: 1, duration: 1000, useNativeDriver: false }).start();

    holdTimer.current = setTimeout(() => {
      setLocked(v => {
        const newState = !v;
        sendLockState(newState ? "lock" : "unlock");
        return newState;
      });

      if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }

      Animated.sequence([
        Animated.timing(holdAnim, { toValue: 0, duration: 0, useNativeDriver: false }),
        Animated.timing(holdAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(holdAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start();
    }, 1000);
  };

  const onPressOut = () => {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    Animated.timing(holdAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  };

  const ringBorderWidth = holdAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 10] });
  const ringOpacity = holdAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.7] });

  return (
    <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}><Feather name="user" size={24} color="#cfe7f5" /></View>
          </View>
          <Text style={styles.title}>Home</Text>
        </View>

        {/* Card */}
        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Front Door</Text>
            <Text style={styles.muted}>Battery Life: {battery}%</Text>

            {/* Lock button */}
            <View style={styles.lockButtonContainer}>
              <Animated.View style={[styles.ring, { borderWidth: ringBorderWidth as any, opacity: ringOpacity as any }]} />
              <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: true }}
                style={({ pressed }) => [styles.lockButton, pressed && { transform: [{ scale: 0.98 }] }]}
              >
                <Feather name={lockIcon} size={125} color="#e2e8f0" />
              </Pressable>
            </View>

            {/* CTA & status */}
            <Text style={styles.cta}>{ctaText}</Text>
            <View style={styles.status}>
              <Text style={styles.history}>{statusText}</Text>
              <Text style={styles.time}>{timeText}</Text>
            </View>

            {/* Pager dots */}
            <View style={styles.dotContainer}>
              <View style={styles.dotsRow}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          </View>
        </View>

        {/* Bottom nav */}

        <BottomNav />

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
    alignItems: "center",
  },

  avatarContainer: {
    width:"100%",
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
    fontWeight: 800,
  },

  cardWrap: {
    flex: 1,
    paddingHorizontal: "7%",
    paddingVertical: "3%",
    marginBottom: "2%",
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
    fontWeight: 700,
    marginBottom: 5,
    textAlign:"center",
  },
  muted: {
    color: "rgba(233,244,255,0.85)",
    fontSize: 18,
    textAlign:"center",
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
    fontWeight: 700,
  },
  status: {
    flex: 1,
    textAlign: "center",
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
