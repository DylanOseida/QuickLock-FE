import { Feather } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/quicklock/bottom-nav";
import { getUserInfo } from '../config/api';

export default function ShareAccess() {
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
          <Pressable style={styles.backContainer} onPress ={() => {if (router.canGoBack()) {router.back()}}}>
            <View style={styles.avatar}><MaterialIcons name="arrow-back-ios-new" size={24} color="white" /></View>
          </Pressable>
          <Pressable style={styles.avatarContainer} onPress ={handleUserDetails}>
            <View style={styles.avatar}><Feather name="user" size={24} color="#cfe7f5" /></View>
          </Pressable>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>New User</Text>
        </View>

        <View style={styles.body}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollStyle} showsVerticalScrollIndicator={false}>

          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>Create New User</Text>
          </Pressable>
        </View>


        {/* Bottom nav */}
        <BottomNav active="users"/>

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
    width: "auto"
  },
    avatarContainer: {
    width: "auto"
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
    marginBottom: "3%",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: "800",
  },

  body: {
    flex: 1,
    paddingHorizontal: "7%",
    paddingBottom: "5%",
   },
   scrollStyle: {
    paddingBottom: "20%",
    gap: "5%", 
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
    fontWeight: "700" 
  },
  
  cardContainer: {
    width: "100%",
  },

});

const row = StyleSheet.create({
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { color: "#E9F4FF", fontSize: 14 },
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { color: "rgba(233,244,255,0.7)", fontSize: 12 },
});
