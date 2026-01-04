import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice"
import { getAuthFromStorage } from "../features/auth/utils/authStorage";

const persistedAuth = getAuthFromStorage();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: persistedAuth
      ? {
          user: persistedAuth.user,
          token: persistedAuth.token,
          isAuthenticated: true,
          loading: false,
          error: null,
        }
      : undefined,
  },
});
