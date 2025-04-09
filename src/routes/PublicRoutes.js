import React from "react";
// import { Navigate } from "react-router-dom";
// import { isLogin } from "../auth";

const PublicRoute = ({ children }) => {
  // Example logic: redirect if logged in
  // if (isLogin()) {
  //   return <Navigate to="/" />;
  // }

  return children;
};

export default PublicRoute;