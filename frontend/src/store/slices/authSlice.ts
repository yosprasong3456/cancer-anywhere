import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Navigate } from "react-router-dom";
import { server } from "../../constants";
// import { LoginResult, RegisterResult } from "../../types/auth-result.type";
// import { User } from "../../types/user.type";
import { httpClient } from "../../utils/HttpClient";
import { RootState } from "../store";
// const navigate = Navigate();
export interface AuthState {
  // loginResult?: LoginResult;
  // registerResult?: RegisterResult;
  isAuthenticating: boolean;
  isAuthented: boolean;
  isError: boolean;
  authData: any;
  themeMode: boolean;
}

const initialState: AuthState = {
  isAuthenticating: true,
  isAuthented: false,
  isError: false,
  authData: null,
  themeMode: localStorage.getItem("THEME_MODE") == "dark" ? true : false,
};

export const login = createAsyncThunk("auth/login", async (value: any) => {
  let result = await httpClient.post<any>(server.LOGIN_URL, value);
  const val = result.data.data[0].token;
  console.log("token", val);
  localStorage.setItem(server.TOKEN_KEY, val);
  if (result.data.message == "success") {
    return result.data;
  }

  throw Error();
});

export const relogin = createAsyncThunk("auth/relogin", async () => {
  let result = await httpClient.get<any>(server.LOGIN_URL);
  const val = result.data.data[0].token;
  console.log("token", val);
  localStorage.setItem(server.TOKEN_KEY, val);
  if (result.data.message == "success") {
    return result.data;
  }

  throw Error();
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    switchTheme: (state: AuthState, action: PayloadAction<void>) => {
      let mode: any = action.payload;
      if (mode === "dark") {
        state.themeMode = true;
        console.log("dark");
      } else {
        console.log("light");
        state.themeMode = false;
      }
      // navigate.push('/login')
    },
    logout: (state: AuthState, action: PayloadAction<void>) => {
      localStorage.removeItem(server.TOKEN_KEY);
      state.isAuthented = false;
      // navigate.push('/login')
    },
    // relogin: (state: AuthState, action: PayloadAction<void>) => {
    //   const _token = localStorage.getItem(server.TOKEN_KEY);
    //   // console.log("relock", JSON.stringify(_token));
    //   if (_token) {
    //     state.isAuthented = true;
    //     if (!state.authData) {
    //       state.authData = JSON.parse(_token);
    //       // state.authData = _token;
    //     }
    //   } else {
    //     state.isAuthented = false;
    //   }
    //   state.isAuthenticating = false;
    // },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.fulfilled, (state, action) => {
      console.log(action.payload);
      if (action.payload.message == "success") {
        state.isAuthented = true;
        state.isError = false;
        state.authData = action.payload;
      } else {
        state.isError = true;
        state.isAuthented = false;
      }
      state.isAuthenticating = false;
    });

    // login
    builder.addCase(login.rejected, (state, action) => {
      state.isError = true;
    });

    builder.addCase(relogin.fulfilled, (state, action) => {
      console.log(action.payload);
      if (action.payload.message == "success") {
        state.isAuthented = true;
        state.isError = false;
        state.authData = action.payload;
      } else {
        state.isError = true;
        state.isAuthented = false;
      }
      state.isAuthenticating = false;
    });
  },
});

export const { logout, switchTheme } = authSlice.actions;
export const authSelector = (store: RootState) => store.authReducer;

export default authSlice.reducer;
