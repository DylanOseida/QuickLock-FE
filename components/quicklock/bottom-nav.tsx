import { Feather } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

function NavItem({icon, active, onPress}: {icon: keyof typeof Feather.glyphMap; active?: boolean; onPress?: () => void;}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && { opacity: 0.6 },]}>
      <Feather name={icon} size={28} style={{padding: 15}} color={active ? "#E5F3FF" : "rgba(229,243,255,0.65)"} />
    </Pressable>
  );
}

export default function BottomNav({ active, onChange }: { active: string, onChange?: (tab: string) => void}){
    const router = useRouter();

    return(
        <View style={styles.navBar}>
            <NavItem icon="home" active={active === "home"} onPress={() => {if (router.canGoBack()) {router.back()} else router.replace("/home")}} />
            <NavItem icon="users" active={active === "users"} onPress={() => {if (router.canGoBack()) {router.back()} else router.replace("/users")}} />
            <NavItem icon="file-text" active={active === "file-text"} onPress={() => {if (router.canGoBack()) {router.back()} else router.replace("/activity-log")}} />
            <NavItem icon="settings" active={active === "settings"} onPress={() => {if (router.canGoBack()) {router.back()} else router.replace("/home")}} />
        </View>
    )
}

const styles = StyleSheet.create({
  navBar: {
    height: "9%",
    width: '96%',
    marginHorizontal: "2%",
    backgroundColor: "#0E1927",
    borderRadius: 50,
    paddingHorizontal: 22,
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

})