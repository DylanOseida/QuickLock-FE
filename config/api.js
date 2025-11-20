import * as SecureStore from 'expo-secure-store';

export const BASE_URL = "http://192.168.X.X:8000"; // your Django backend IP

export async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register_user/`, {
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

const LOGIN_ENDPOINT = `${BASE_URL}/auth/login/`;

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

export async function saveTokens(tokens) {
  // adapt to what your server returns
  // if tokens.access / tokens.refresh:
  if (!tokens || typeof tokens !== 'object') return;

  if (tokens.access) {
    await SecureStore.setItemAsync('accessToken', tokens.access);
  }

  if (tokens.refresh) {
    await SecureStore.setItemAsync('refreshToken', tokens.refresh);
  }

  if (tokens.token) {
    await SecureStore.setItemAsync('accessToken', tokens.token);
  }
}

export async function getAccessToken() {
  return SecureStore.getItemAsync('accessToken');
}

export async function logout() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}
