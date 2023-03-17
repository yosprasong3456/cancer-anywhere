import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./slices/authSlice";
import personHisSlice from "./slices/personHisSlice";
personHisSlice;
const reducer = {
  authReducer,
  personHisSlice,
};

export const store = configureStore({
  reducer,
  // devTools: process.env.NODE_ENV === "development",
  devTools: import.meta.env.VITE_IS_PRODUCTION === "0", // show redux log in dev mode
});

// export type of root state from reducers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
