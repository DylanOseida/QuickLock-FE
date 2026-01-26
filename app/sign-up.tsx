// screens/SignUpScreen.js (replace your current file)
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../assets/styles/colors';
import Variables from '../assets/styles/variables';
import { loginUser, registerUser, saveTokens } from "../config/api";

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    if(!username) return "Please enter a username.";
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
    const userData = {
      username: username,
      email: email,
      password: password,
    };

    console.log("attempting registration.");
    const registerResp = await registerUser(userData);
    console.log("Registered:", registerResp);

    try {
      
      console.log("attempting login.");

      const tokens = await loginUser({ username, password });
      console.log('login response:', tokens);
      await saveTokens(tokens);
      router.push("/home"); 
    } catch (loginErr) {
      console.warn("Auto-login failed:", loginErr);
      alert("Account created. Please log in.");
      router.push("/login");
    }
  } catch (err) {
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
      <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject} />

      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>to get started now!</Text>
      </View>

      <View style={styles.form}>
        <View style ={styles.inputStyle}>
          <FontAwesome  style={[styles.icon, {padding: 2}]} name="user" size={24}/>          
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.placeholder}
            value={username}
            keyboardType="default"
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style ={styles.inputStyle}>
          <MaterialIcons style={styles.icon}  name="email" size={24}/>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={Colors.placeholder}
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style ={styles.inputStyle}>
          <MaterialCommunityIcons style={styles.icon} name="lock" size={24}/>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style ={styles.inputStyle}>
          <MaterialCommunityIcons style={styles.icon} name="lock" size={24}/>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.placeholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.signUpText}>Sign Up</Text>}
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.questionText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={{...Variables.underlinedText}}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// styles: same as your original, you can paste your existing styles object here.
// For brevity, reuse the styles from your original file (no changes required)
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  header:{ ...Variables.header },
  title: { fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 18, color: 'white', textAlign: 'center' },
  form:{ alignItems: 'center', justifyContent: 'center', gap: 20 },
  inputStyle:{ ...Variables.inputStyle, backgroundColor: Colors.text_input },
  icon:{ marginLeft: 5, marginRight: 5, color: Colors.white, },
  input:{ ...Variables.input },
  signUpButton: { ...Variables.buttons, marginTop: '20%', backgroundColor: '#FFFFFF' },
  signUpText: { ...Variables.buttonsText, color: 'black' },
  footer:{ ...Variables.footer },
  lineContainer:{ width: Variables.buttons.width, alignItems: 'center' },
  line:{ height: 1, backgroundColor: 'white', width: '100%' },
  loginContainer:{ ...Variables.linkContainer },
  questionText:{ color: 'white' },
});
