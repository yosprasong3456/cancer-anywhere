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
  isLoadingCA: boolean;
  postLoading: boolean;
  isError: boolean;
  personAll: any;
  personOne: any;
  personCA: any;
  personSearch: any;
  errorSearch: boolean;
  searching: boolean;
}

const initialState: AuthState = {
  isLoading: true,
  isLoadingCA: true,
  postLoading: true,
  isError: false,
  personAll: [],
  personOne: null,
  personCA: [],
  personSearch: null,
  errorSearch: false,
  searching: false,
};

export const sendPersonOne = createAsyncThunk(
  "personHis/sendPersonOne",
  async (params: string) => {
    let result = await httpClient.post<any>(server.SEND_PERSON_ONE, params);
    if (result.data.message == "success") {
      return result.data;
    } else {
      throw Error();
    }

    //   throw Error();
  }
);

export const getPersonSearch = createAsyncThunk(
  "personHis/getPersonSearch",
  async (params: string) => {
    let result = await httpClient.get<any>(server.PERSON_SEARCH + params);
    if (result.data.message == "success") {
      return result.data.data;
    } else {
      throw Error();
    }

    //   throw Error();
  }
);

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
  reducers: {
    resetSearch: (state: AuthState, action: PayloadAction<void>) => {
      state.personSearch = null;
    },
  },
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
      state.isLoadingCA = true;
    });
    builder.addCase(getPersonHisCA.fulfilled, (state, action) => {
      state.personCA = action.payload;
      state.isLoadingCA = false;
    });
    builder.addCase(getPersonHisCA.rejected, (state, action) => {
      state.isError = true;
      state.isLoadingCA = false;
    });
    builder.addCase(getPersonSearch.pending, (state, action) => {
      state.searching = true;
      state.personSearch = null;
      state.errorSearch = false;
    });
    builder.addCase(getPersonSearch.fulfilled, (state, action) => {
      state.personSearch = action.payload;
      state.searching = false;
      state.errorSearch = false;
    });
    builder.addCase(getPersonSearch.rejected, (state, action) => {
      state.searching = false;
      state.errorSearch = true;
    });
  },
});

export const { resetSearch } = personHisSlice.actions;
export const personHisSelector = (store: RootState) => store.personHisSlice;

export default personHisSlice.reducer;
