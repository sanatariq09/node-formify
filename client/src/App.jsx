import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", contact: "" });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const loadUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

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

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
      } else {
        await axios.post(API, form);
      }

      setForm({ name: "", email: "", contact: "" });
      setEditId(null);
      loadUsers();
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data.errors || {});
      }
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, contact: user.contact });
    setEditId(user.id);
    setErrors({});
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", contact: "" });
    setEditId(null);
    setErrors({});
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Users
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.name
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={100}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={form.contact}
              onChange={handleChange}
              required
              inputMode="numeric"
              pattern="[0-9]*"
              minLength={7}
              maxLength={15}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.contact
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.contact && (
              <p className="text-xs text-red-500 mt-1">{errors.contact}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded px-3 py-2"
            >
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded px-3 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 space-y-2">
          {users.length === 0 && (
            <p className="text-sm text-gray-400 text-center">No users yet</p>
          )}

          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-500">{user.contact}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={editId === user.id}
                  className="text-xs text-red-500 hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
