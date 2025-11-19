export const BASE_URL = "http://127.0.0.1:8000"; // your Django backend

export async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register_user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

/*async function loginUser() {

    const response = await fetch(`${BASE_URL}/auth/get_user/`,)


}*/