import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Analysis from "./pages/Analysis";
import Auth from "./pages/Auth";
import RequireAuth from "./routes/RequireAuth";

export default function App() {
  return (
    <Routes>
      {/* публичный роут */}
      <Route path="/auth" element={<Auth />} />

      {/* приватные роуты под RequireAuth */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path="/analysis"
        element={
          <RequireAuth>
            <Analysis />
          </RequireAuth>
        }
      />
      <Route
        path="/chat"
        element={
          <RequireAuth>
            <Chat />
          </RequireAuth>
        }
      />

      {/* всё остальное — на / (но с проверкой auth) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
