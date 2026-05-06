import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from "../components/quicklock/accordion";
import BottomNav from "../components/quicklock/bottom-nav";
import { fetchUsersByAdmin, getUserInfo } from '../config/api';


type AccessUser = {
  id?: number | string | null;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

const TEMPORARY_LOCK_LABEL = "Front Door";
const permanentUsers: AccessUser[] = [];

export default function Users() {
  const router = useRouter();
  const [temporaryUsers, setTemporaryUsers] = useState<AccessUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadUsers = async () => {
        try {
          setLoadingUsers(true);
          setUsersError(null);

          // 1. Check current user
          const currentUser = await getUserInfo();

          const isAdmin = currentUser?.admin === true;

          // 2. If NOT admin → stop here
          if (!isAdmin) {
            setTemporaryUsers([]);
            setUsersError("Administrator access is required to view users.");
            return;
          }

          // 3. If admin → fetch users
          const users = await fetchUsersByAdmin();

          setTemporaryUsers(users);
        } catch (error) {
          console.error("Error fetching users:", error);
          setTemporaryUsers([]);
          setUsersError("We couldn't load users right now.");
        } finally {
          setLoadingUsers(false);
        }
      };

      loadUsers();

      return () => {
        active = false;
      };
    }, []),
  );

    
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

  const getUserDisplayName = (user: AccessUser) => {
    const fullName = [user.first_name, user.last_name]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(" ");

    return (
      fullName ||
      user.username?.trim() ||
      user.email?.trim() ||
      (user.id !== null && user.id !== undefined ? `User #${user.id}` : "Unknown User")
    );
  };

  return (
    <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Pressable style={styles.avatar} onPress ={handleUserDetails}><Feather name="user" size={24} color="#cfe7f5" /></Pressable>
          </View>
          <Text style={styles.title}>Users</Text>
        </View>

        <View style={styles.body}>
          {loadingUsers ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color="#E9F4FF" />
              <Text style={styles.stateTitle}>Loading users...</Text>
            </View>
          ) : usersError ? (
            <View style={styles.stateContainer}>
              <Text style={styles.stateTitle}>{usersError}</Text>
            </View>
          ) : (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollStyle} showsVerticalScrollIndicator={false}>
              <Accordion title="Permanent Access">
                {permanentUsers.map((u, index) => (
                  <UserRow
                    key={String(u.id ?? u.username ?? u.email ?? index)}
                    name={getUserDisplayName(u)}
                    rightLabel={TEMPORARY_LOCK_LABEL}
                  />
                ))}
              </Accordion>

              <Accordion title="Temporary Access">
                {temporaryUsers.map((u, index) => (
                  <UserRow
                    key={String(u.id ?? u.username ?? u.email ?? index)}
                    name={getUserDisplayName(u)}
                    rightLabel={TEMPORARY_LOCK_LABEL}
                  />
                ))}
              </Accordion>

              <Accordion title="Cards">
                <UserRow name="Card #1" rightLabel="John Doe" />
              </Accordion>

              <View style={styles.footer}>

                {/* TEMPORARY navigation to share access screen */}
                <Pressable style={styles.shareBtn} onPress={() => router.push("/share-access")}> 
                  <Feather name="share-2" size={16} color="#E9F4FF" />
                  <Text style={styles.shareBtnText}>Share Access</Text>
                </Pressable>
              </View>

            </ScrollView>
          )}
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
    gap: 15, 
   },

  footer: {
    height: "auto",
    width: "100%",

    marginVertical: "5%",
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
  stateContainer: {
    flex: 1,
    paddingHorizontal: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  stateTitle: {
    marginTop: 20,
    color: "#E9F4FF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
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
