import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import api from "../api/axios";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    const res = await api.post("/auth/login", form);
    onLogin(res.data.token, res.data.admin);
    navigate("/users");
  };

  return <AuthForm mode="login" onSubmit={handleSubmit} />;
}
