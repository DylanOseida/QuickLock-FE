import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const BASE_URL = `https://quicklock-be.onrender.com`;

//export const ESP32_URL = "http://192.168.X.X"
const REGISTER_ENDPOINT = `${BASE_URL}/auth/register_user/`;
const LOGIN_ENDPOINT = `${BASE_URL}/auth/login/`;
const LOCK_STATUS_ENDPOINT = (id) => `${BASE_URL}/access/Locks/${id}/status/`;
const LOCK_ACTION_ENDPOINT = (id) =>
  `${BASE_URL}/access/Locks/${id}/mobile_unlock/`;
const LOCKS_BY_ACCESS_ENDPOINT = `${BASE_URL}/access/Locks/list_by_user_access/`;

function createNetworkError(action, url, err) {
  const message = err?.message ? ` ${err.message}` : "";
  const networkError = new Error(
    `${action} network error. Could not reach ${url}.${message}`,
  );
  networkError.originalError = err;
  networkError.isNetworkError = true;
  return networkError;
}

export async function checkBackendReachability() {
  try {
    await fetch(BASE_URL, { method: "GET" });
  } catch (err) {
    throw createNetworkError("Backend reachability check", BASE_URL, err);
  }
}

export async function saveTokens(tokens) {
  if (!tokens) return;

  try {
    if (Platform.OS === "web") {
      if (tokens.access) localStorage.setItem("accessToken", tokens.access);
      if (tokens.refresh) localStorage.setItem("refreshToken", tokens.refresh);
    } else {
      if (tokens.access)
        await SecureStore.setItemAsync("accessToken", tokens.access);
      if (tokens.refresh)
        await SecureStore.setItemAsync("refreshToken", tokens.refresh);
    }
  } catch (err) {
    console.error("Failed to save tokens:", err);
  }
}

export async function getAccessToken() {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem("accessToken");
    } else {
      return await SecureStore.getItemAsync("accessToken");
    }
  } catch (err) {
    console.error("Failed to read access token:", err);
    return null;
  }
}

export async function removeTokens() {
  if (Platform.OS === "web") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } else {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }
}

export async function getUserInfo() {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token available");

  const response = await axios.get(`${BASE_URL}/auth/user_info/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
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
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      const err = new Error("Registration failed");
      err.status = response.status;
      err.payload = data;
      throw err;
    }
    return data;
  } catch (err) {
    console.error(
      "registerUser error:",
      err.status,
      err.payload || err.message,
    );
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
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch NFC status:", err);
    return { authorized: false, uid: "" };
  }
}

//Login User
export async function loginUser({ username, password }) {
  let res;
  try {
    res = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch (err) {
    throw createNetworkError("Login", LOGIN_ENDPOINT, err);
  }

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const err = new Error("Login failed");
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}

export async function fetchLockStatus() {
  const lockId = await getStoredLockId();

  if (!lockId) return null;

  const res = await fetch(LOCK_STATUS_ENDPOINT(lockId), { method: "GET" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      await removeLockId();
    }
    console.error("Failed to fetch lock status:", res.status, data);
    return null;
  }

  return data.status;
}

export async function fetchLocks() {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  try {
    const res = await axios.get(LOCKS_BY_ACCESS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;

    console.error("Failed to fetch locks:", status, data || err.message);
    if (!err.response) {
      throw createNetworkError("Fetch locks", LOCKS_BY_ACCESS_ENDPOINT, err);
    }

    const apiError = new Error("Fetch locks failed");
    apiError.status = status;
    apiError.payload = data;
    throw apiError;
  }
}

export async function fetchActivityLogs() {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  try {
    const res = await axios.get(`${BASE_URL}/access/Logs/read_by_user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;

    console.error("Failed to fetch activity logs:", status, data || err.message);
    throw err;
  }
}

export async function fetchAdminLocks() {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  try {
    const res = await axios.get(`${BASE_URL}/access/Locks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;

    console.error("Failed to fetch admin locks:", status, data || err.message);
    throw err;
  }
}

export async function saveLockId(lockId) {
  if (lockId === null || lockId === undefined || String(lockId).trim() === "") {
    return removeLockId();
  }

  const value = String(lockId);

  if (Platform.OS === "web") {
    localStorage.setItem("lockId", value);
  } else {
    await SecureStore.setItemAsync("lockId", value);
  }
}

export async function getStoredLockId() {
  if (Platform.OS === "web") {
    return localStorage.getItem("lockId");
  } else {
    return await SecureStore.getItemAsync("lockId");
  }
}

export async function removeLockId() {
  if (Platform.OS === "web") {
    localStorage.removeItem("lockId");
  } else {
    await SecureStore.deleteItemAsync("lockId");
  }
}

export async function toggleLock() {
  const token = await getAccessToken();
  if (!token) {
    console.warn("No access token available; cannot toggle lock.");
    return null;
  }

  const lockId = await getStoredLockId();
  if (!lockId) {
    console.warn("No lockId stored; cannot toggle lock.");
    return null;
  }

  const res = await fetch(LOCK_ACTION_ENDPOINT(lockId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lock_id: Number(lockId) }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to toggle lock. HTTP:", res.status, data);
    return null;
  }

  return data.lock_status;
}

const GENERATE_KEY_ENDPOINT = `${BASE_URL}/access/Keys/`;

export async function generateKey(data) {
  const token = await getAccessToken();
  if (!token) {
    const err = new Error("No access token available");
    err.status = 401;
    throw err;
  }

  const res = await fetch(GENERATE_KEY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch (e) {
    payload = text;
  }

  if (!res.ok) {
    const err = new Error("generateKey failed");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

export async function logoutUser() {
  try {
    await removeTokens();
    await removeLockId();
    console.log("user logged out")
  } catch (err) {
    console.error("Logout failed:", err);
  }
}
