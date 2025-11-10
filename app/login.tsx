import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../assets/styles/colors';
import Variables from '../assets/styles/variables';

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  

  return (
    <View style={styles.container}>

      {/* Background Gradient */}
      <LinearGradient
        colors={['#0E1927', '#1D3047']} 
        style={StyleSheet.absoluteFillObject}   
      />

      {/* Welcome */}

      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Secure Made Simple</Text>
      </View>

      {/* Email & Password */}

      <View style={styles.form}>
        <View style ={styles.inputStyle}>
          <MaterialIcons style={styles.icon}  name="email" size={24}/>
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={Colors.placeholder} value={email} keyboardType="email-address" onChangeText={setEmail} autoCapitalize="none" />
        </View>

        <View style ={styles.inputStyle}>
          <MaterialCommunityIcons style={styles.icon} name="lock" size={24}/>
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.placeholder} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
        </View>
      </View>

      {/* Buttons */}

      <View style={styles.forgotContainer}>
        <TouchableOpacity onPress={() => router.push('/forgot-pass')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View> 

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Line Break */}

      <View style={styles.footer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.questionText}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text style={{...Variables.underlinedText}}>Sign Up</Text>
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
  forgotContainer:{
    width: Variables.buttons.width,
    alignItems: 'flex-end',
    marginTop: 10,
  },
  forgotText:{
    ...Variables.underlinedText,
  },

  /********* Buttons *********/
  loginButton: {
    ...Variables.buttons,
    marginTop: '20%',
    backgroundColor: '#FFFFFF',
  },
  loginText: {
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
  signUpContainer:{
    ...Variables.linkContainer,
  },
    questionText:{
    color: 'white',
  },
});
