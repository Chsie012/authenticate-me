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

// Thunk to handle user signup
export const signup = createAsyncThunk(
  "session/signup",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up.");
      }

      const data = await response.json();
      return data.user; // Assuming the backend response contains { user }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to restore the session user after a page refresh or app load
export const restoreSessionUser = createAsyncThunk(
  "session/restore",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Attempting to restore session...");
      const response = await csrfFetch("/api/session");
      console.log("Response received:", response);
      if (!response.ok) {
        throw new Error("Failed to restore session.");
      }
      const data = await response.json();
      console.log("Session data:", data);
      return data.user;
    } catch (error) {
      console.error("Error in restoreSessionUser:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to handle user logout
export const logout = createAsyncThunk(
  "session/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/session", {
        method: "DELETE",
        credential: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to log out.");
      }

      return null; // Return null since we want to clear the user on logout
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  status: 'idle',  // To handle loading and errors
  error: null,
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
      // Handling login action
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        console.error("Login failed:", action.payload);
        state.error = action.payload;
      })
      // Handling restore session action
      .addCase(restoreSessionUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(restoreSessionUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(restoreSessionUser.rejected, (state, action) => {
        state.status = 'failed';
        console.error("Failed to restore session:", action.payload);
        state.error = action.payload;
      });
  },
});

// Export actions & reducer
export const { logout: localLogout } = sessionSlice.actions;
export default sessionSlice.reducer;
