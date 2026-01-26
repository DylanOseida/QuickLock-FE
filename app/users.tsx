import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from "../components/quicklock/accordion";
import BottomNav from "../components/quicklock/bottom-nav";
import { getUserInfo } from '../config/api';


const CARD_WIDTH = 0.86;
const LOCK_ID = "1"; 

export default function Users() {
  const router = useRouter();

  const permanentUsers = [
    { id: "1", name: "John Doe", lockLabel: "All Locks" },
    { id: "2", name: "Jane Doe", lockLabel: "All Locks" },
    { id: "3", name: "Jane Doe", lockLabel: "All Locks" },
    { id: "4", name: "Jane Doe", lockLabel: "All Locks" },
    { id: "5", name: "Jane Doe", lockLabel: "All Locks" },

  ];

  const temporaryUsers = [
    { id: "3", name: "Matt Smith", lockLabel: "Front Door" },
  ];

    
  function UserRow({ name, rightLabel }: { name: string; rightLabel?: string }) {
    return (
      <View style={row.row}>
        <Text style={row.name}>{name}</Text>
        <View style={row.right}>
          {rightLabel ? <Text style={row.label}>{rightLabel}</Text> : null}
          <Feather name="chevron-right" size={16} color="rgba(233,244,255,0.7)" />
        </View>
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

  return (
    <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.avatarContainer} onPress ={handleUserDetails}>
            <View style={styles.avatar}><Feather name="user" size={24} color="#cfe7f5" /></View>
          </Pressable>
          <Text style={styles.title}>Users</Text>
        </View>

        <View style={styles.body}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollStyle} showsVerticalScrollIndicator={false}>
            <Accordion title="Permanent Access">
              {permanentUsers.map((u) => (
                <UserRow key={u.id} name={u.name} rightLabel={u.lockLabel} />
              ))}
            </Accordion>

            <Accordion title="Temporary Access">
              {temporaryUsers.map((u) => (
                <UserRow key={u.id} name={u.name} rightLabel={u.lockLabel} />
              ))}
            </Accordion>

            <Accordion title="Cards">
              <UserRow name="Card #1" rightLabel="John Doe" />
            </Accordion>

          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.shareBtn}>
            <Feather name="share-2" size={16} color="#E9F4FF" />
            <Text style={styles.shareBtnText}>Share Access</Text>
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
