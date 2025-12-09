import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/quicklock/bottom-nav";

const CARD_WIDTH = 0.86; 


export default function Settings() {

  return (
    <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}><Feather name="user" size={24} color="#cfe7f5" /></View>
          </View>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>



        </View>

        {/* Bottom nav */}

        <BottomNav active="settings"/>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },

  /*HEADER*/
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

  /*BODY*/
  body:{




  },




});
