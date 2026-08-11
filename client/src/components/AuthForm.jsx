import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({ mode, onSubmit }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      await onSubmit(form);
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 401) {
        setMessage(err.response.data.message || "Invalid credentials");
      } else {
        setMessage("Something went wrong, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-display font-bold text-sm shadow-sm shadow-indigo-200">
            F
          </div>
          <span className="font-display font-semibold text-lg text-slate-900 tracking-tight">
            Formify
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-200/60 p-7">
          <h1 className="font-display font-semibold text-xl text-slate-900 mb-1">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {isRegister
              ? "Set up an admin account to get started"
              : "Sign in to manage your users"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                      : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                    : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                    : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
              )}
            </div>

            {message && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <p className="text-xs text-red-600">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-3 py-2.5 transition-colors shadow-sm shadow-indigo-200"
            >
              {loading ? "Please wait…" : isRegister ? "Create account" : "Login"}
            </button>
          </form>
        </div>

        <p className="text-xs text-slate-500 mt-5 text-center">
          {isRegister ? "Already have an account?" : "No account yet?"}{" "}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}
