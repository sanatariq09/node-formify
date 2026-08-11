import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import UserFormModal from "../components/UserFormModal";
import ConfirmModal from "../components/ConfirmModal";

const PAGE_SIZE = 5;

export default function UsersPage({ admin, onLogout }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const res = await api.get("/users");
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    if (editingUser) {
      await api.put(`/users/${editingUser.id}`, values);
      setToast("User updated");
    } else {
      await api.post("/users", values);
      setToast("User added");
    }

    setModalOpen(false);
    loadUsers();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setToast("User deleted");
      setDeleteTarget(null);
      loadUsers();
    } finally {
      setDeleting(false);
    }
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Navbar name={admin?.name} onLogout={onLogout} />

      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="font-display font-semibold text-2xl text-slate-900 tracking-tight">
                Users
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {users.length} {users.length === 1 ? "user" : "users"} total
              </p>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-3.5 py-2.5 transition-colors shadow-sm shadow-indigo-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add user
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500">
                    <th className="py-3 pl-5 pr-3 font-medium text-xs uppercase tracking-wide">Name</th>
                    <th className="py-3 pr-3 font-medium text-xs uppercase tracking-wide">Email</th>
                    <th className="py-3 pr-3 font-medium text-xs uppercase tracking-wide">Contact</th>
                    <th className="py-3 pr-5 font-medium text-xs uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 pl-5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 shrink-0 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold flex items-center justify-center">
                            {initials(user.name) || "?"}
                          </div>
                          <span className="text-slate-800 font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-slate-500">{user.email}</td>
                      <td className="py-3 pr-3 text-slate-500">{user.contact}</td>
                      <td className="py-3 pr-5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(user)}
                            title="Edit user"
                            aria-label="Edit user"
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            title="Delete user"
                            aria-label="Delete user"
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && users.length === 0 && (
                <div className="text-center py-14 px-4">
                  <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">No users yet</p>
                  <p className="text-xs text-slate-400 mt-1">Add your first user to get started</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 text-xs text-slate-500">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  Prev
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <UserFormModal
        open={modalOpen}
        user={editingUser}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this user?"
        message={
          deleteTarget
            ? `${deleteTarget.name} will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete user"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
