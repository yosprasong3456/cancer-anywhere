import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type Props = {
  isAuthented: boolean;
};
const PublicRoutes = ({ isAuthented }: Props) => {
  const location = useLocation();
  console.log("PublicRoutes", isAuthented);
  // return <Outlet />;
  if (!isAuthented) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default PublicRoutes;
