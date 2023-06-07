import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Header from "./layouts/Header";
import Login from "./pages/Login";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ProtectedRoutes from "./router/protected.routes";
import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  Grid,
  makeStyles,
  responsiveFontSizes,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { blue, green, pink } from "@mui/material/colors";
import Home from "./pages/Home";
import PublicRoutes from "./router/public.routes";
import { useSelector } from "react-redux";
import { authSelector, relogin } from "./store/slices/authSlice";
import { useAppDispatch } from "./store/store";
import BasicBreadcrumbs from "./components/Breadcrumbs";
import FirstPage from "./pages/FirstPage";
import PersonCA from "./pages/PersonCA";
import { SnackbarProvider } from "notistack";
import Footer from "./components/Footer";
import lightGreen from "@mui/material/colors/lightGreen";
import SearchPerson from "./pages/SearchPerson";

function App() {
  const dispatch = useAppDispatch();
  const authReducer = useSelector(authSelector);
  useEffect(() => {
    // called during created
    dispatch(relogin());
    console.log("1env", import.meta.env.VITE_TEST_KEY);
    console.log("production", import.meta.env);
  }, [dispatch]);

  let theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
          },
        },
      },
    },
    spacing: 8,
    typography: {
      fontFamily: "Kanit",
      fontWeightLight: 300,
      fontWeightRegular: 400,
    },
    palette: {
      mode: authReducer.themeMode ? "dark" : "light",
      primary: !import.meta.env.DEV ? { main: "#009688" } : { main: "#009688" },

      //   main: blue["A200"],

      // },
      // secondary: pink,
      background: {
        // default: "black",
      },
    },
  });
  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={10}
        autoHideDuration={3000}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        className="Snackbar"
      />
      {authReducer.isAuthented && <Header />}
      <Routes>
        {authReducer.isAuthented ? (
          <Route element={<ProtectedRoutes />}>
            <Route path="/welcome" element={<FirstPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/personCA" element={<PersonCA />} />
            <Route path="/search" element={<SearchPerson />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
    </ThemeProvider>
  );
}

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      spacing={0}
      // align="center"
      // justify="center"
      direction="column"
      style={{
        alignContent: "center",
        justifyContent: "center",
        height: "85vh",
      }}
    >
      <Grid item>
        <Typography variant="h3">Error 404</Typography>
        <Typography variant="h4">Page not found.</Typography>
        <Button
          variant="text"
          sx={{ padding: 2 }}
          onClick={() => navigate("/welcome")}
        >
          กลับหน้าหลัก
        </Button>
      </Grid>
    </Grid>
  );
};

export default App;
