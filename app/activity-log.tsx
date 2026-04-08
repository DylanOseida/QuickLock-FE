import { Feather } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/quicklock/bottom-nav";
import { getUserInfo } from '../config/api';

const CARD_WIDTH = 0.86;
const LOCK_ID = "1"; 

export default function ActivityLog() {

  const router = useRouter();

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
    <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.avatarContainer} onPress ={handleUserDetails}>
            <View style={styles.avatar}><Feather name="user" size={24} color="#cfe7f5" /></View>
          </Pressable>
          <Text style={styles.title}>Activity Log</Text>
        </View>

        {/* Card */}
        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>History</Text>

            <View style={styles.log}>
              <View style={styles.doorAccessedIcon}>
                <AntDesign name="home" size={35}  color="white" />              
              </View>

              <View style={styles.doorDetails}>
                <Text style={styles.doorAccessed}>Front Door</Text>
                <Text style={styles.user}>Locked by John Doe</Text>
              </View>

              <View style={styles.timeStamp}>
                <Text style={styles.date}>10/27/25</Text>
                <Text style={styles.time}>10:28 AM</Text>
              </View>
            </View>

            <View style={styles.log}>
              <View style={styles.doorAccessedIcon}>
                <AntDesign name="home" size={35}  color="white" />              
              </View>

              <View style={styles.doorDetails}>
                <Text style={styles.doorAccessed}>Front Door</Text>
                <Text style={styles.user}>Unlocked by John Doe</Text>
              </View>

              <View style={styles.timeStamp}>
                <Text style={styles.date}>10/27/25</Text>
                <Text style={styles.time}>10:27 AM</Text>
              </View>
            </View>

            <View style={styles.log}>
              <View style={styles.doorAccessedIcon}>
                <AntDesign name="home" size={35}  color="white" />              
              </View>

              <View style={styles.doorDetails}>
                <Text style={styles.doorAccessed}>Garage Door</Text>
                <Text style={styles.user}>Unlocked by Jake Waters</Text>
              </View>

              <View style={styles.timeStamp}>
                <Text style={styles.date}>10/27/25</Text>
                <Text style={styles.time}>08:54 AM</Text>
              </View>
            </View>

          </View>
        </View>

        {/* Bottom nav */}
        <BottomNav active="file-text"/>

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
    fontWeight: 800,
  },
  cardWrap: {
    flex: 1,
    paddingHorizontal: "7%",
    paddingBottom: "5%",
  },
  card: {
    width: "100%",
    height: "100%",
    alignItems: "center",
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
    textAlign: "center",
  },

  log: {
    width: "85%",
    height: "15%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },

  doorAccessedIcon: {
    width: "auto",
  },

  doorDetails: {
    width: "65%",
    height: "100%",
    paddingLeft: "5%",
    flexDirection: "column",
    gap: 1,
    alignItems: "flex-start",
    justifyContent: "center",    
  },
  doorAccessed: {
    color: "white",
    fontSize: 18,
    fontWeight: 400,
  },
  user: {
    color: "white",
    fontSize: 12,
    fontWeight: 400,
  },

  timeStamp: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    gap: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  date: {
    color: "white",
    fontSize: 12,
    fontWeight: 400,
  },
  time: {
    color: "white",
    fontSize: 12,
    fontWeight: 400,
  },

  history: {
    textAlign: "center",
    color: "#CFE7F5",
    fontSize: 20,
  },
});
