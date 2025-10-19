import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export default function RequireAuth({ children }) {
  const authed = isAuthed();
  const location = useLocation();
  if (!authed) {
    // запомним, куда хотел попасть пользователь
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return children;
}
