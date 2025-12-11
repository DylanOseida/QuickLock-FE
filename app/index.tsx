import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Logo from '../assets/images/QuickLock-Logo.png';
import Colors from '../assets/styles/colors';
import Variables from '../assets/styles/variables';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Background Gradient */}
      <LinearGradient
        colors={['#0E1927', '#1D3047']}
        style={StyleSheet.absoluteFillObject}
      />
    
      {/* App Name */}
      <View style={styles.header}>
        {/* Lock Icon */}
        <Image source={Logo} style={styles.image} />
        <Text style={styles.title}>QuickLock</Text>
        <Text style={styles.subtitle}>Secure Made Simple</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/sign-up')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  /********* Header *********/
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header:{
    ...Variables.header,
  },
  image:{
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },

  /********* Buttons *********/
  loginButton: {
    ...Variables.buttons,
    backgroundColor: '#FFFFFF',
  },
  loginText: {
    ...Variables.buttonsText,
    color: 'black',
  },
  signUpButton: {
    ...Variables.buttons,
    backgroundColor: Colors.text_input,
  },
  signUpText: {
    ...Variables.buttonsText,
    color: 'white',
  },

});