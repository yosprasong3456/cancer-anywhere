import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { server } from "../../constants";
// import { LoginResult, RegisterResult } from "../../types/auth-result.type";
// import { User } from "../../types/user.type";
import { httpClient } from "../../utils/HttpClient";
import { RootState } from "../store";

export interface AuthState {
  // loginResult?: LoginResult;
  // registerResult?: RegisterResult;
  isLoading: boolean;
  postLoading: boolean;
  isError: boolean;
  personAll: any;
  personOne: any;
  personCA: any;
}

const initialState: AuthState = {
  isLoading: true,
  postLoading: true,
  isError: false,
  personAll: [],
  personOne: null,
  personCA: [],
};

export const getPersonHis = createAsyncThunk(
  "personHis/getPersonHis",
  async () => {
    console.log("get");
    let result = await httpClient.get<any>(server.PERSON_HIS_ALL);
    if (result.data.message == "success") {
      return result.data.data;
    } else {
      throw Error();
    }

    //   throw Error();
  }
);

export const getPersonHisCA = createAsyncThunk(
  "personHis/getPersonHisCA",
  async () => {
    let result = await httpClient.get<any>(server.PERSON_HIS_ALL_CA);
    if (result.data.message == "success") {
      return result.data.data;
    } else {
      throw Error();
    }

    //   throw Error();
  }
);

export const sendDataToCA = createAsyncThunk(
  "personHis/sendDataToCA",
  async (params: any) => {
    let result = await httpClient.post<any>(server.SEND_DATA_TO_CA, params);
    if (result.data.message == "success") {
      return result.data.message;
    } else {
      return result.data;
    }

    //   throw Error();
  }
);

const personHisSlice = createSlice({
  name: "personHis",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login
    builder.addCase(getPersonHis.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPersonHis.fulfilled, (state, action) => {
      state.personAll = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getPersonHis.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(sendDataToCA.pending, (state, action) => {
      state.postLoading = true;
    });
    builder.addCase(sendDataToCA.fulfilled, (state, action) => {
      state.isError = false;
      state.postLoading = false;
    });
    builder.addCase(getPersonHisCA.pending, (state, action) => {
      state.isError = false;
      state.isLoading = true;
    });
    builder.addCase(getPersonHisCA.fulfilled, (state, action) => {
      state.personCA = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getPersonHisCA.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export const {} = personHisSlice.actions;
export const personHisSelector = (store: RootState) => store.personHisSlice;

export default personHisSlice.reducer;
