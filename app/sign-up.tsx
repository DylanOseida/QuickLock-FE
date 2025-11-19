import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../assets/styles/colors';
import Variables from '../assets/styles/variables';
import { registerUser } from "../config/api";

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  
  const handleSignUp = async () => {

    try {

      const userData = {
      username: email,
      email: email,
      password: password,
      first_name: "Test",
      last_name: "User",
      is_staff: false,
      is_active: true,
      is_superuser: false,
      };

      const response = await registerUser(userData);
      console.log('User registered successfully:', response);
      alert("Account created successfully!");
      router.push("/login");
    }
    catch(error){
      console.error("Sign-up failed:", error);
      alert("Sign-up failed. Check console for details."); //temp alert
    }
  };

  return (
    <View style={styles.container}>

      {/* Background Gradient */}
      <LinearGradient
        colors={['#0E1927', '#1D3047']} 
        style={StyleSheet.absoluteFillObject}   
      />

      {/* Create Account */}

      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>to get started now!</Text>
      </View>

      {/* Create Email & Password */}

      <View style={styles.form}>
        <View style ={styles.inputStyle}>
          <MaterialIcons style={styles.icon}  name="email" size={24}/>
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={Colors.placeholder} value={email} keyboardType="email-address" onChangeText={setEmail} autoCapitalize="none" />
        </View>

        <View style ={styles.inputStyle}>
          <MaterialCommunityIcons style={styles.icon} name="lock" size={24}/>
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.placeholder} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
        </View>

        <View style ={styles.inputStyle}>
          <MaterialCommunityIcons style={styles.icon} name="lock" size={24}/>
          <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor={Colors.placeholder} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
        </View>
      </View>

      {/* Buttons */}

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Footer */}

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

const styles = StyleSheet.create({

  /********* Header *********/
  container: { 
    flex: 1, 
    alignItems: 'center', 
  },
  header:{
    ...Variables.header,
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

  /********* Form (Input) *********/
  form:{
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  inputStyle:{
    ...Variables.inputStyle,
    backgroundColor: Colors.text_input,
  },
  icon:{
    marginLeft: 5,
    marginRight: 5,
    color: Colors.white,
  },
  input:{
    ...Variables.input,
  },

  /********* Buttons *********/
  signUpButton: {
    ...Variables.buttons,
    marginTop: '20%',
    backgroundColor: '#FFFFFF',
  },
  signUpText: {
    ...Variables.buttonsText,
    color: 'black',
  },

  /********* Footer *********/
  footer:{
    ...Variables.footer,
  },
  lineContainer:{
    width: Variables.buttons.width,
    alignItems: 'center',
  },
  line:{
    height: 1, 
    backgroundColor: 'white',
    width: '100%',
  },
  loginContainer:{
    ...Variables.linkContainer,
  },
    questionText:{
    color: 'white',
  },
});
