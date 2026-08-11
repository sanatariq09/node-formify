import { useEffect, useState } from "react";
import Modal from "./Modal";

const emptyForm = { name: "", email: "", contact: "" };

export default function UserFormModal({ open, user, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(user ? { name: user.name, email: user.email, contact: user.contact } : emptyForm);
      setErrors({});
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact") {
      setForm({ ...form, contact: value.replace(/\D/g, "") });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await onSubmit(form);
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data.errors || {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-display font-semibold text-lg text-slate-900 mb-5">
        {user ? "Edit user" : "Add user"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={handleChange}
            required
            maxLength={100}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
            }`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Contact</label>
          <input
            type="text"
            name="contact"
            placeholder="03001234567"
            value={form.contact}
            onChange={handleChange}
            required
            inputMode="numeric"
            pattern="[0-9]*"
            minLength={7}
            maxLength={15}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
              errors.contact
                ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
            }`}
          />
          {errors.contact && <p className="text-xs text-red-500 mt-1.5">{errors.contact}</p>}
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-3 py-2.5 transition-colors shadow-sm shadow-indigo-200"
          >
            {loading ? "Saving…" : user ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg px-3 py-2.5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
