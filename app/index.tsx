import Fontisto from '@expo/vector-icons/Fontisto';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';




export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Background Gradient */}
      <LinearGradient
        colors={['#0E1927', '#1D3047']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Lock Icon */}
      <Fontisto name="locked" style={{marginBottom: 20}} size={50} color="#00AEEF" />

      {/* App Name */}
      <Text style={styles.title}>QuickLock</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/sign-up')}>
        <Text style={styles.signUpText}>Sign-Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  loginButton: {
    width: '70%',
    height:'auto',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 15,
    marginBottom: 20,
  },
  loginText: {
    color: 'black',
    fontWeight: 'normal',
    fontSize: 20,
    textAlign: 'center',
  },
  signUpButton: {
    width: '70%',
    height: 'auto',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 15,
  },
  signUpText: {
    color: 'white',
    fontWeight: 'normal',
    fontSize: 20,
    textAlign: 'center',

  },
});