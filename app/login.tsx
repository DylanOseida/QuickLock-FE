// screens/LoginScreen.js
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../assets/styles/colors';
import Variables from '../assets/styles/variables';
import { loginUser, saveTokens } from '../config/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!email) return 'Please enter your email.';
    if (!password) return 'Please enter your password.';
    return null;
  };

  const handleLogIn = async () => {
    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      // your backend expects { username, password } per working curl
      const resp = await loginUser({ username: email, password });
      console.log('login response:', resp);

      // Save tokens if present (function handles different shapes)
      await saveTokens(resp);

      // If your backend returns no tokens (session cookie approach), you may need to
      // rely on cookie-based auth (not covered here) or change backend to return JWTs.
      alert('Login successful');

      // Navigate to protected/home screen
      router.push('/'); // change route as needed
    } catch (err) {
      console.error('Login failed:', err.status, err.payload || err.message);
      // show the most useful message available
      const msg =
        (err.payload && (err.payload.detail || JSON.stringify(err.payload))) ||
        err.message ||
        'Login failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0E1927', '#1D3047']} style={StyleSheet.absoluteFillObject} />

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

      <View style={styles.forgotContainer}>
        <TouchableOpacity onPress={() => router.push('/forgot-pass')} disabled={loading}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogIn} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.loginText}>Login</Text>}
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.questionText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/sign-up')} disabled={loading}>
            <Text style={{ ...Variables.underlinedText }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Styles same as your original file (paste them or import)
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  header: { ...Variables.header },
  title: { fontSize: 40, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 18, color: 'white', textAlign: 'center' },
  form: { alignItems: 'center', justifyContent: 'center', gap: 20 },
  inputStyle: { ...Variables.inputStyle, backgroundColor: Colors.text_input },
  icon: { marginLeft: 5, marginRight: 5, color: Colors.white },
  input: { ...Variables.input },
  forgotContainer: { width: Variables.buttons.width, alignItems: 'flex-end', marginTop: 10 },
  forgotText: { ...Variables.underlinedText },
  loginButton: { ...Variables.buttons, marginTop: '20%', backgroundColor: '#FFFFFF' },
  loginText: { ...Variables.buttonsText, color: 'black' },
  footer: { ...Variables.footer },
  lineContainer: { width: Variables.buttons.width, alignItems: 'center' },
  line: { height: 1, backgroundColor: 'white', width: '100%' },
  signUpContainer: { ...Variables.linkContainer },
  questionText: { color: 'white' },
});
