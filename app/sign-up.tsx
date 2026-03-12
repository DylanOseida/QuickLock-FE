// screens/SignUpScreen.js
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../assets/styles/colors";
import Variables from "../assets/styles/variables";
import {
  fetchLocks,
  getAccessToken,
  getStoredLockId,
  loginUser,
  registerUser,
  removeLockId,
  removeTokens,
  saveLockId,
  saveTokens,
} from "../config/api";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!username) return "Please enter a username.";
    if (!email) return "Please enter an email.";
    if (!password) return "Please enter a password.";
    if (password.length < 6) return "Password should be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSignUp = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    try {
      // 🔥 Clear any stale session/lock from a previous user
      await removeLockId();
      await removeTokens();
      console.log("SIGNUP after clears lockId:", await getStoredLockId());

      // 1) Register
      const userData = {
        username,
        email,
        password,
        admin: false,
      };

      console.log("SIGNUP attempting registration...");
      const registerResp = await registerUser(userData);
      console.log("SIGNUP Registered:", registerResp);

      // 2) Auto-login (your backend expects username/password)
      console.log("SIGNUP attempting login...");
      const tokens = await loginUser({ username, password });
      console.log("SIGNUP login response:", tokens);
      await saveTokens(tokens);

      console.log("SIGNUP access token after login:", await getAccessToken());

      // 3) Fetch lock access for THIS user
      const locks = await fetchLocks();
      console.log("SIGNUP fetchLocks result:", locks);

      if (!Array.isArray(locks) || locks.length === 0) {
        // No access → keep lockId cleared so Home shows "No lock access"
        await removeLockId();
        console.log("SIGNUP no-locks lockId:", await getStoredLockId());
        router.replace("/home");
        return;
      }

      // 4) Save first lock (you only have one lock)
      await saveLockId(locks[0].lock_id);
      console.log("SIGNUP saved lockId:", await getStoredLockId());

      // 5) Go Home
      router.replace("/home");
    } catch (err) {
      // If anything fails, make sure we don’t leave stale auth/lockId around
      await removeLockId();
      await removeTokens();

      console.error("Sign-up failed:", err.status, err.payload || err.message);
      const msg =
        (err.payload && (err.payload.detail || JSON.stringify(err.payload))) ||
        err.message ||
        "Sign-up failed.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0E1927", "#1D3047"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>to get started now!</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputStyle}>
          <FontAwesome
            style={[styles.icon, { padding: 2 }]}
            name="user"
            size={24}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.placeholder}
            value={username}
            keyboardType="default"
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

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

        <View style={styles.inputStyle}>
          <MaterialCommunityIcons style={styles.icon} name="lock" size={24} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.placeholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? <ActivityIndicator /> : <Text style={styles.signUpText}>Sign Up</Text>}
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.questionText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/login")} disabled={loading}>
            <Text style={{ ...Variables.underlinedText }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: { ...Variables.header },
  title: { fontSize: 40, fontWeight: "bold", color: "white", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "white", textAlign: "center" },
  form: { alignItems: "center", justifyContent: "center", gap: 20 },
  inputStyle: { ...Variables.inputStyle, backgroundColor: Colors.text_input },
  icon: { marginLeft: 5, marginRight: 5, color: Colors.white },
  input: { ...Variables.input },
  signUpButton: { ...Variables.buttons, marginTop: "20%", backgroundColor: "#FFFFFF" },
  signUpText: { ...Variables.buttonsText, color: "black" },
  footer: { ...Variables.footer },
  lineContainer: { width: Variables.buttons.width, alignItems: "center" },
  line: { height: 1, backgroundColor: "white", width: "100%" },
  loginContainer: { ...Variables.linkContainer },
  questionText: { color: "white" },
});