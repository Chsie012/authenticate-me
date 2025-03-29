// frontend/src/store/session.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { csrfFetch } from "./csrf";

// Thunk to handle user login
export const login = createAsyncThunk(
  "session/login",
  async ({ credential, password }, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({ credential, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to log in.");
      }

      const data = await response.json();
      return data.user; // Assuming the backend response contains { user }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
};

// Create session slice
const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        console.error("Login failed:", action.payload);
      });
  },
});

// Export actions & reducer
export const { logout } = sessionSlice.actions;
export default sessionSlice.reducer;
