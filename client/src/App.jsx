import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsersPage from "./pages/UsersPage";

function readAdmin() {
  const raw = localStorage.getItem("admin");
  return raw ? JSON.parse(raw) : null;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [admin, setAdmin] = useState(readAdmin);

  const handleLogin = (newToken, newAdmin) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("admin", JSON.stringify(newAdmin));
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken(null);
    setAdmin(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          token ? <Navigate to="/users" replace /> : <LoginPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/register"
        element={
          token ? <Navigate to="/users" replace /> : <RegisterPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/users"
        element={
          token ? (
            <UsersPage admin={admin} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={token ? "/users" : "/login"} replace />} />
    </Routes>
  );
}
