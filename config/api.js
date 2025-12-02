import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const BASE_URL = "http://192.168.X.X:8000"; 
export const ESP32_URL = "http://192.168.X.X"
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

export async function sendLockState(state) {
  const url = `${ESP32_URL}/${state}`; 

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("ESP32 response:", data);
  } catch (err) {
    console.error("Failed to call ESP32:", err);
  }
}

export async function fetchNFCStatus() {
  try {
    const res = await fetch(`${ESP32_URL}/nfc-status`);
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    return data;
  } catch (err) {
    console.error("Failed to fetch NFC status:", err);
    return { authorized: false, uid: "" };
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


