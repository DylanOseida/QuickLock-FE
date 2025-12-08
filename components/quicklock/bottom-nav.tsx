import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

function NavItem({icon, active}: {icon: keyof typeof Feather.glyphMap; active?: boolean;}) {
  return (
    <View style={styles.navItem}>
      <Feather name={icon} size={28} color={active ? "#E5F3FF" : "rgba(229,243,255,0.65)"} />
    </View>
  );
}

export default function BottomNav(){

    return(
        <View style={styles.navBar}>
            <NavItem icon="home" active />
            <NavItem icon="users" />
            <NavItem icon="file-text" />
            <NavItem icon="settings" />
        </View>
    )
}

const styles = StyleSheet.create({
  navBar: {
    marginHorizontal: "3%",
    backgroundColor: "#0E1927",
    borderRadius: 50,
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

})