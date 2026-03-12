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
import { fetchLocks, getAccessToken, getStoredLockId, loginUser, removeLockId, removeTokens, saveLockId, saveTokens } from "../config/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!email) return "Please enter your email.";
    if (!password) return "Please enter your password.";
    return null;
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleLogIn = async () => {

    console.log("LOGINSCREEN handleLogIn CALLED");
    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
  try {
    await removeLockId();
    console.log("LOGIN after removeLockId lockId:", await getStoredLockId());
    await removeTokens();

    const resp = await loginUser({ username: email, password });
    await saveTokens(resp);

    console.log("ACCESS TOKEN AFTER LOGIN:", await getAccessToken());

    const locks = await fetchLocks();
    
    if (!Array.isArray(locks) || locks.length === 0) {
      await removeLockId();
      console.log("LOGIN no-locks lockId:", await getStoredLockId());
      router.replace("/home");
      return;
    }

    await saveLockId(locks[0].lock_id);
    router.replace("/home");
  } catch (err) {
    await removeLockId();
    console.log("LOGIN after removeLockId lockId:", await getStoredLockId());
    await removeTokens();

      console.error("Login failed:", err.status, err.payload || err.message);
      const msg =
        (err.payload && (err.payload.detail || JSON.stringify(err.payload))) ||
        err.message ||
        "Login failed";
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Secure Made Simple</Text>
      </View>

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
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor={Colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!loading}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.forgotContainer}>
          <TouchableOpacity
            onPress={() => router.push("/forgot-pass")}
            disabled={loading}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogIn}
          disabled={loading}
        >
          {loading ? <ActivityIndicator /> : <Text style={styles.loginText}>Login</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.questionText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")} disabled={loading}>
              <Text style={{ ...Variables.underlinedText }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// Styles same as your original file (paste them or import)
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: { ...Variables.header },
  title: { fontSize: 40, fontWeight: "bold", color: "white", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "white", textAlign: "center" },
  form: { alignItems: "center", justifyContent: "center", gap: 20 },
  inputStyle: { ...Variables.inputStyle, backgroundColor: Colors.text_input },
  icon: { marginLeft: 5, marginRight: 5, color: Colors.white },
  input: { ...Variables.input },
  forgotContainer: {
    width: Variables.buttons.width,
    alignItems: "flex-end",
    marginTop: 10,
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
  signUpContainer: { ...Variables.linkContainer },
  questionText: { color: "white" },
});
