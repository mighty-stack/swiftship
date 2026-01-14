import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../components/axios";

const initialState = {
  earnings: [],
  totalEarnings: 0,
  pendingEarnings: 0,
  loading: false,
  error: null,
};

export const fetchEarnings = createAsyncThunk(
  "earnings/fetchEarnings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/earnings");
      return data; // expected array of earnings: { _id, driverId, jobId, amount, status, createdAt, paidAt, type }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const earningsSlice = createSlice({
  name: "earnings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
        state.totalEarnings = action.payload.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        state.pendingEarnings = action.payload
          .filter((e) => e.status === "pending")
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch earnings";
      });
  },
});

export default earningsSlice.reducer;
