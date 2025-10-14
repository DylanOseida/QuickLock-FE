import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* Welcome */}
      <Text style={styles.title}>Hello!</Text>
      <Text style={styles.subtitle}>Welcome back.</Text>


      {/* Email & Password */}
      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#A0A0A0" value={email} keyboardType="email-address" onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#A0A0A0" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#232F3E',
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
  },
  input:{
    backgroundColor: '#1C2632',
    color: 'white',
    width: '75%',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 20,
  },




});
