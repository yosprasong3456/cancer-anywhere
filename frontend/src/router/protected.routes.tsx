import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { authSelector } from "../store/slices/authSlice";
import { useAppDispatch } from "../store/store";

type Props = {};
const ProtectedRoutes = ({}: Props) => {
  const dispatch = useAppDispatch();
  const authReducer = useSelector(authSelector);
  console.log("ProtectedRoutes");
  return authReducer.isAuthented ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
