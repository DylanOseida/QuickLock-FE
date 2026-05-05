// screens/LoginScreen.js
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
import { checkBackendReachability, fetchLocks, getAccessToken, getStoredLockId, loginUser, removeLockId, removeTokens, saveLockId, saveTokens } from "../config/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateCredentials = () => {
    if (!email) return "Please enter your email.";
    if (!password) return "Please enter your password.";
    return null;
  };

  const handleLogin = async () => {
    console.log("LOGINSCREEN handleLogin CALLED");
    const validationError = validateCredentials();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      // Reset any previous session state before logging in a new user.
      await removeLockId();
      console.log("LOGIN after removeLockId lockId:", await getStoredLockId());
      await removeTokens();

      await checkBackendReachability();
      const authTokens = await loginUser({ username: email, password });
      await saveTokens(authTokens);

      console.log("ACCESS TOKEN AFTER LOGIN:", await getAccessToken());

      const availableLocks = await fetchLocks();

      if (!Array.isArray(availableLocks) || availableLocks.length === 0) {
        await removeLockId();
        console.log("LOGIN no-locks lockId:", await getStoredLockId());
        router.replace("/home");
        return;
      }

      // Preserve the current behavior of selecting the first accessible lock.
      await saveLockId(availableLocks[0].lock_id);
      router.replace("/home");
    } catch (err) {
      await removeLockId();
      console.log("LOGIN after removeLockId lockId:", await getStoredLockId());
      await removeTokens();

      console.error("Login failed:", err.status, err.payload || err.message);
      const errorMessage =
        (err.payload && (err.payload.detail || JSON.stringify(err.payload))) ||
        err.message ||
        "Login failed";
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Secure Made Simple</Text>
      </View>

      <View style={styles.form}>
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
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor={Colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.passwordToggleButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={loading}
          >
            <MaterialCommunityIcons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity
            onPress={() => router.push("/forgot-pass")}
            disabled={loading}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator /> : <Text style={styles.loginText}>Login</Text>}
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>

        <View style={styles.authLinkRow}>
          <Text style={styles.authPromptText}>Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")} disabled={loading}>
            <Text style={{ ...Variables.underlinedText }}>Sign Up</Text>
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
  form: { gap: 20},
  inputContainer: { ...Variables.inputStyle, backgroundColor: Colors.text_input },
  icon: { marginLeft: 5, marginRight: 5, color: Colors.white },
  input: { ...Variables.input },
  passwordToggleButton: { paddingHorizontal: 2 },
  forgotPasswordContainer: {
    marginTop: -5,
    alignItems: "flex-end",
  },
  forgotText: { ...Variables.underlinedText },
  loginButton: {
    ...Variables.buttons,
    marginTop: "20%",
    backgroundColor: "#FFFFFF",
  },
  loginText: { ...Variables.buttonsText, color: "black" },
  footer: { ...Variables.footer },
  lineContainer: { width: Variables.buttons.width, alignItems: "center" },
  line: { height: 1, backgroundColor: "white", width: "100%" },
  authLinkRow: { ...Variables.linkContainer },
  authPromptText: { color: "white" },
});
