import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const BASE_URL = "http://192.168.0.228:8000"; 
const REGISTER_ENDPOINT = `${BASE_URL}/auth/register_user/`;
const LOGIN_ENDPOINT = `${BASE_URL}/auth/login/`;

//Register User
export async function registerUser(userData) {
  try {
    const response = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch (e) { data = text; }

    if (!response.ok) {
      const err = new Error('Registration failed');
      err.status = response.status;
      err.payload = data;
      throw err;
    }
    return data;
  } catch (err) {
    console.error("registerUser error:", err.status, err.payload || err.message);
    throw err;
  }
}

//Login User
export async function loginUser({ username, password }) {
  const res = await fetch(LOGIN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = text; }

  if (!res.ok) {
    const err = new Error('Login failed');
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}

//Save Tokens
export async function saveTokens(tokens) {
  if (!tokens) return;

  try {
    if (Platform.OS === 'web') {
      if (tokens.access) localStorage.setItem('accessToken', tokens.access);
      if (tokens.refresh) localStorage.setItem('refreshToken', tokens.refresh);
    } else {
      if (tokens.access) await SecureStore.setItemAsync('accessToken', tokens.access);
      if (tokens.refresh) await SecureStore.setItemAsync('refreshToken', tokens.refresh);
    }
  } catch (err) {
    console.error('Failed to save tokens:', err);
  }
}


