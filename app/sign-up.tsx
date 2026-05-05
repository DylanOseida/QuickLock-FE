// screens/SignUpScreen.js
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ExpoCheckbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
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
  const [lockIdEnabled, setLockIdEnabled] = useState(false);
  const [lockId, setLockId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateRegistrationForm = () => {
    if (!username) return "Please enter a username.";
    if (!email) return "Please enter an email.";
    if (!password) return "Please enter a password.";
    if (password.length < 6) return "Password should be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSignUp = async () => {
    const validationError = validateRegistrationForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);

    try {
      // 🔥 Clear any stale session/lock from a previous user
      await removeLockId();
      await removeTokens();
      console.log("SIGNUP after clears lockId:", await getStoredLockId());

      const registrationPayload = {
        username,
        email,
        password,
        admin: lockIdEnabled,
      };

      console.log("SIGNUP attempting registration...");
      const registrationResponse = await registerUser(registrationPayload);
      console.log("SIGNUP Registered:", registrationResponse);

      // Preserve the current flow that logs the user in immediately after sign-up.
      console.log("SIGNUP attempting login...");
      const authTokens = await loginUser({ username, password });
      console.log("SIGNUP login response:", authTokens);
      await saveTokens(authTokens);

      console.log("SIGNUP access token after login:", await getAccessToken());

      const availableLocks = await fetchLocks();
      console.log("SIGNUP fetchLocks result:", availableLocks);

      if (!Array.isArray(availableLocks) || availableLocks.length === 0) {
        // No access → keep lockId cleared so Home shows "No lock access"
        await removeLockId();
        console.log("SIGNUP no-locks lockId:", await getStoredLockId());
        router.replace("/home");
        return;
      }

      // Preserve the current behavior of storing the first available lock.
      await saveLockId(availableLocks[0].lock_id);
      console.log("SIGNUP saved lockId:", await getStoredLockId());

      router.replace("/home");
    } catch (err: any) {
      // If anything fails, make sure we don’t leave stale auth/lockId around
      await removeLockId();
      await removeTokens();

      console.error("Sign-up failed:", err.status, err.payload || err.message);
      const errorMessage =
        (err.payload && (err.payload.detail || JSON.stringify(err.payload))) ||
        err.message ||
        "Sign-up failed.";
      alert(errorMessage);
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

      <View style={styles.formCard}>
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
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

          <View style={styles.inputContainer}>
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

          <View style={styles.inputContainer}>
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

          <View style={styles.inputContainer}>
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

          <View style={styles.checkboxContainer}>
            <ExpoCheckbox
              style={styles.checkbox}
              value={lockIdEnabled}
              onValueChange={setLockIdEnabled}
              color={lockIdEnabled ? "rgba(255,255,255,0.14)" : undefined}
              disabled={loading}
            />
            <Text style={styles.checkboxText}>lock id</Text>
          </View>

          {lockIdEnabled && (
            <View style={styles.inputContainer}>
              <Feather style={styles.icon} name="hash" size={24} />
              <TextInput
                style={styles.input}
                placeholder="Lock ID"
                placeholderTextColor={Colors.placeholder}
                value={lockId}
                keyboardType="number-pad"
                onChangeText={setLockId}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          )}
        </ScrollView>
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

        <View style={styles.authLinkRow}>
          <Text style={styles.authPromptText}>Already have an account?</Text>
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
  formCard: {
    width: "100%",
    maxHeight: 325,
    alignItems: "center",
    marginBottom: "5%",
  },
  formScroll: {
    width: "100%",
  },
  form: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingBottom: 10,
  },
  inputContainer: { ...Variables.inputStyle, backgroundColor: Colors.text_input },
  icon: { marginLeft: 5, marginRight: 5, color: Colors.white },
  input: { ...Variables.input },
  checkboxContainer: {
    width: "86%",
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  checkboxText: {
    color: "white",
  },
  signUpButton: { ...Variables.buttons, marginTop: "4%", backgroundColor: "#FFFFFF" },
  signUpText: { ...Variables.buttonsText, color: "black" },
  footer: { ...Variables.footer },
  lineContainer: { width: Variables.buttons.width, alignItems: "center" },
  line: { height: 1, backgroundColor: "white", width: "100%" },
  authLinkRow: { ...Variables.linkContainer },
  authPromptText: { color: "white" },
});
