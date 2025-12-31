import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // change if needed
  withCredentials: false,
});

// Helper: safely extract error message
function getError(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
}

export const authApi = {
  /* ======================
          REGISTER
  ====================== */
  register: async (data) => {
    try {
      const res = await API.post("/register", data);
      return {
        success: true,
        user: res.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: getError(error),
      };
    }
  },

  /* ======================
            LOGIN
  ====================== */
  login: async (data) => {
    try {
      const res = await API.post("/login", data);
      return {
        success: true,
        token: res.data.token, // must match backend
        user: res.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: getError(error),
      };
    }
  },

  /* ======================
         CHECK AUTH
  ====================== */
  checkAuth: async (token) => {
  const res = await fetch("http://localhost:5000/api/auth/check-auth", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return await res.json();
},
};
