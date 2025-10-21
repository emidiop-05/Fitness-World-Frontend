import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../lib/auth";

export default function PrivateRoute() {
  return auth.isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}
