import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../components/axios";

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"), 
};

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ fullName, email, password, phone }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", {
        fullName,
        email,
        password,
        phone,
      });

      const { user, token } = res.data;

      if (token) localStorage.setItem("token", token);

      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { user, token } = res.data;

      if (token) localStorage.setItem("token", token);

      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async () => {
    localStorage.removeItem("token");
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      /* === Register === */
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* === Login === */
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      /* === Logout === */
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
