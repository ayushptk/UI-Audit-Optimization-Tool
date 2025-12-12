const BASE_URL = "http://127.0.0.1:8000";

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),

  });
  console.log("The data is " + res);

  if (!res.ok) throw new Error("Invalid login");

  return res.json(); // { access_token }
}

export async function registerUser(username, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) throw new Error("Register failed");

  return res.json();
}

export async function fetchUserProfile(token) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user profile");

  return res.json();
}
