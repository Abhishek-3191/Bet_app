import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../utils/authApi";
import { toast } from "sonner";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    const res = await authApi.login(data);
    if (!res.success) return rejectWithValue(res.message);

    // sessionStorage.setItem("token", res.data.token);

    // // ✅ Correct token
    sessionStorage.setItem("token", JSON.stringify(res.token));
    toast.success("Login Successful");

    return res.user;
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    const res = await authApi.register(data);
    if (!res.success) return rejectWithValue(res.message);

    toast.success("Registered Successfully");
    return res.user;
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (token, { rejectWithValue }) => {
    const res = await authApi.checkAuth(token);

    if (!res.success) return rejectWithValue("Invalid token");
    return res.user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false; // ⭐ FIX
      })

      // REGISTER SUCCESS
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false; // ⭐ FIX
      })

      // CHECK AUTH SUCCESS
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })

      // CHECK AUTH FAIL (no token / invalid)
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
