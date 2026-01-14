import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../components/axios";

export const addShipmentAsync = createAsyncThunk(
  "shipments/addShipmentAsync",
  async (shipmentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/shipments", shipmentData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchShipments = createAsyncThunk(
  "shipments/fetchShipments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/shipments");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateShipment = createAsyncThunk(
  "shipments/updateShipment",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/shipments/${id}`, { ...updates });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// assign driver
export const assignDriver = createAsyncThunk(
  "shipments/assignDriver",
  async ({ shipmentId, driverId }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/shipments/${shipmentId}/assign-driver`, { driverId });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const shipmentsSlice = createSlice({
  name: "shipments",
  initialState: {
    shipments: [],
    currentShipment: null,
    loading: false,
    error: null,
  },
  reducers: {
    addShipment: (state, action) => {
      state.shipments.unshift(action.payload);
    },
    setShipment: (state, action) => {
      state.currentShipment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addShipmentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShipmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments.unshift(action.payload);
      })
      .addCase(addShipmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add shipment";
      })

      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateShipment.fulfilled, (state, action) => {
        const idx = state.shipments.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.shipments[idx] = action.payload;
      })

      .addCase(assignDriver.fulfilled, (state, action) => {
        const idx = state.shipments.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.shipments[idx] = action.payload;
      });
  },
});

export const { addShipment, setShipment } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
