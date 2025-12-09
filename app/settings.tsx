import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from '../assets/styles/colors';
import Variables from '../assets/styles/variables';


const CARD_WIDTH = 0.86; 


export default function Settings() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  
  return (
    <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.avatarContainer} onPress ={() => router.push("/home")}>
            <View style={styles.avatar}><Feather name="user" size={24} color="#cfe7f5" /></View>
          </Pressable>
          <Text style={styles.title}>Account</Text>
        </View>

        {/* Body */}
        <View style={styles.form}>
          <View style={styles.inputStyle}>
            <MaterialIcons style={styles.icon} name="email" size={24} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={Colors.placeholder}
              value={email}
              keyboardType="email-address"
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputStyle}>
            <MaterialCommunityIcons style={styles.icon} name="lock" size={24} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
        </View>
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
    textAlign: "center",
  },

  /*BODY*/
  form: { alignItems: 'center', justifyContent: 'center', gap: 20 },
  inputStyle: { ...Variables.inputStyle, backgroundColor: Colors.text_input },
  icon: { marginLeft: 5, marginRight: 5, color: Colors.white },
  input: { ...Variables.input },



});
