import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';


export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>

      {/* Background Gradient */}
      <LinearGradient
        colors={['#0E1927', '#1D3047']} 
        style={StyleSheet.absoluteFillObject}   
      />

      {/* Welcome */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Secure Made Simple</Text>


      {/* Email & Password */}
      <View style ={styles.inputStyle}>
      <MaterialIcons style={styles.icon}  name="email" size={24} color="#00ABFD" />
      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#A0A0A0" value={email} keyboardType="email-address" onChangeText={setEmail} autoCapitalize="none" />
      </View>

      <View style ={styles.inputStyle}>
      <MaterialCommunityIcons style={styles.icon} name="lock" size={24} color="#00ABFD" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#A0A0A0" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
      </View>

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
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 75,
  },
  inputStyle:{
    width: '75%',
    height:'auto',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 20,
  },

  icon:{
    marginLeft: 5,
    marginRight: 5,
  },
  input:{
    backgroundColor:'trasparent',
    flex: 1,
    height: 20,
    color: 'white',
  },

});
