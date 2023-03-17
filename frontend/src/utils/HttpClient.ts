// import { logout } from "@/store/slices/authSlice";
// import { store } from "@/store/store";
import axios from "axios";
import join from "url-join";
import { server, apiUrl } from "../constants";
import { logout } from "../store/slices/authSlice";
import { store } from "../store/store";

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async (config: any) => {
  if (!isAbsoluteURLRegex.test(config.url!)) {
    config.url = join(apiUrl, config.url!);
  }

  const userToken = localStorage.getItem(server.TOKEN_KEY);
  if (userToken) {
    config.headers = { Authorization: `Bearer ${userToken}` };
  }
  config.timeout = 20000; // 20 Second
  return config;
});

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     console.log(JSON.stringify(error, undefined, 2));
//     // without Hook
//     // store.dispatch(logout());
//   }
// );

export const httpClient = axios;
