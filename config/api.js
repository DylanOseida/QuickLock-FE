import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const BASE_URL = "http://10.41.45.213:8000"; 
//export const ESP32_URL = "http://192.168.X.X"
const REGISTER_ENDPOINT = `${BASE_URL}/auth/register_user/`;
const LOGIN_ENDPOINT = `${BASE_URL}/auth/login/`;
const LOCK_STATUS_ENDPOINT = `${BASE_URL}/embedded/request_status/`;
const LOCK_ACTION_ENDPOINT = `${BASE_URL}/embedded/mobile_request/`;

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

export async function getAccessToken() {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem('accessToken');
    } else {
      return await SecureStore.getItemAsync('accessToken');
    }
  } catch (err) {
    console.error('Failed to read access token:', err);
    return null;
  }
}

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

export async function sendLockState(state) {
  const url = `${ESP32_URL}/${state}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

    console.log("ESP32 response:", data);
  } catch (err) {
    console.error("Failed to call ESP32:", err);
  }
}

export async function fetchLockStatus(lockId = "1") {
  try {
    const res = await fetch(LOCK_STATUS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lock_id: lockId }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch lock status. HTTP:", res.status, data);
      return null;
    }

    if (typeof data.lock_status === "boolean") {
      return data.lock_status;
    }

    console.warn("Unexpected lockStatus response:", data);
    return null;

  } catch (err) {
    console.error("Error fetching lock status:", err);
    return null;
  }
}

export async function toggleLock(lockId = "1") {
  const token = await getAccessToken();

  if (!token) {
    console.warn("No access token available; cannot toggle lock.");
    return null;
  }

  try {
    const res = await fetch(LOCK_ACTION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ lock_id: lockId }),
    });

    const data = await res.json(); 

    if (!res.ok) {
      console.error("Failed to toggle lock. HTTP:", res.status, data);
      return null;
    }

    if (typeof data.lock_status === "boolean") {
      return data.lock_status;
    }

    console.warn("Unexpected toggleLock response format:", data);
    return null;

  } catch (err) {
    console.error("Error calling mobile_request API:", err);
    return null;
  }
}
