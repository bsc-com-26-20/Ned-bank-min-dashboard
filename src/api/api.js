const API_URL = "http://localhost:5000";

// Get access token from localStorage
function getToken() {
  return localStorage.getItem("accessToken");
}

// API request wrapper
export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  return response.json();
}
