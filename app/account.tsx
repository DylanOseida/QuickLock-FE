import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../assets/styles/colors";
import Variables from "../assets/styles/variables";
import BottomNav from "../components/quicklock/bottom-nav";

const CARD_WIDTH = 0.86;

export default function Account() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();

  const [userDetails, setUserDetails] = useState(() => {
    return params.userDetails ? JSON.parse(params.userDetails as string) : {};
  });

  return (
    <LinearGradient
      colors={["#0E1927", "#1D3047"]}
      style={StyleSheet.absoluteFillObject}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.backContainer}>
            <Pressable
              style={styles.avatarContainer}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                }
              }}
            >
              <View style={styles.avatar}>
                <MaterialIcons
                  name="arrow-back-ios-new"
                  size={24}
                  color="white"
                />
              </View>
            </Pressable>
          </View>

          <Text style={styles.title}>Account</Text>
        </View>

        {/* Body */}
        <View style={styles.form}>
          <View style={styles.userDetail}>
            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>User ID</Text>
            </View>
            <View style={styles.inputStyle}>
              <Feather style={styles.icon} name="hash" size={24} />
              <TextInput
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
                value={userDetails.username}
                keyboardType="name-phone-pad"
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.userDetail}>
            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>Email</Text>
            </View>
            <View style={styles.inputStyle}>
              <MaterialIcons style={styles.icon} name="email" size={24} />
              <TextInput
                style={styles.input}
                value={userDetails.email}
                placeholder="Email"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.forgotContainer}>
            <TouchableOpacity
              onPress={() => router.push("/account")}
              disabled={loading}
            >
              <Text style={styles.forgotText}>Change Email</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userDetail}>
            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>Password</Text>
            </View>
            <View style={styles.inputStyle}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="lock"
                size={24}
              />
              <TextInput
                style={styles.input}
                value={"***********"}
                placeholder="Password"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.forgotContainer}>
            <TouchableOpacity
              onPress={() => router.push("/account")}
              disabled={loading}
            >
              <Text style={styles.forgotText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.signUpText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        <BottomNav active="settings" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /*HEADER*/
  header: {
    flexDirection: "column",
    marginTop: "3%",
    alignItems: "center",
  },
  backContainer: {
    width: "100%",
    paddingLeft: "3%",
  },
  avatarContainer: {
    width: "10%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  avatar: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: 800,
    textAlign: "center",
  },

  /*BODY*/
  form: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  userDetail: {
    width: "100%",
    alignItems: "center",
    gap: 5,
  },
  subTitleContainer: {
    width: "75%",
    marginTop: "8%",
  },
  subTitle: {
    color: "#E9F4FF",
    fontSize: 25,
  },
  inputStyle: {
    ...Variables.inputStyle,
    backgroundColor: Colors.text_input,
  },
  icon: {
    marginLeft: 5,
    marginRight: 5,
    color: Colors.placeholder,
  },
  input: {
    ...Variables.input,
    textAlignVertical: "center",
  },
  forgotContainer: {
    width: Variables.buttons.width,
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: -10,
  },
  forgotText: {
    ...Variables.underlinedText,
  },

  /*FOOTER*/
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  signUpButton: {
    ...Variables.buttons,
    backgroundColor: Colors.red,
  },
  signUpText: {
    ...Variables.buttonsText,
    color: "white",
  },
});
