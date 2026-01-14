import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../components/axios";

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

// fetch all jobs (driver dashboard or admin)
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/jobs");
    return data; // array of jobs
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchJobById = createAsyncThunk("jobs/fetchJobById", async (jobId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/jobs/${jobId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// accept job
export const acceptJob = createAsyncThunk("jobs/acceptJob", async (jobId, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/jobs/${jobId}/accept`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// start job
export const startJob = createAsyncThunk("jobs/startJob", async (jobId, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/jobs/${jobId}/start`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// complete job - backend should also create earning record
export const completeJob = createAsyncThunk("jobs/completeJob", async (jobId, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/jobs/${jobId}/complete`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch jobs";
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.currentJob = action.payload;
      })
      .addCase(acceptJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        const idx = state.jobs.findIndex((j) => j._id === action.payload._id);
        if (idx !== -1) state.jobs[idx] = action.payload;
      })
      .addCase(startJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        const idx = state.jobs.findIndex((j) => j._id === action.payload._id);
        if (idx !== -1) state.jobs[idx] = action.payload;
      })
      .addCase(completeJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        const idx = state.jobs.findIndex((j) => j._id === action.payload._id);
        if (idx !== -1) state.jobs[idx] = action.payload;
      });
  },
});

export const { clearCurrentJob } = jobsSlice.actions;
export default jobsSlice.reducer;
