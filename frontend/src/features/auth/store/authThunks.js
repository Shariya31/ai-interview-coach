import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../services/auth.api";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginUser(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerUser(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);