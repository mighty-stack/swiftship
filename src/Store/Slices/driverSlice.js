import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../components/axios";

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchDriverProfile = createAsyncThunk(
  "driver/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/drivers/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateDriverProfile = createAsyncThunk(
  "driver/updateProfile",
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/drivers/${userId}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchDriverProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch profile";
      })
      .addCase(updateDriverProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriverProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateDriverProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to update profile";
      });
  },
});

export default driverSlice.reducer;
