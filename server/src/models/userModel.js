import db from "../config/db.js";

async function findByIdRaw(id) {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

export async function getAll(adminId) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE admin_id = ? ORDER BY id DESC",
    [adminId]
  );
  return rows;
}

export async function findById(id, adminId) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id = ? AND admin_id = ?",
    [id, adminId]
  );
  return rows[0];
}

export async function create(adminId, { name, email, contact }) {
  const [result] = await db.query(
    "INSERT INTO users (name, email, contact, admin_id) VALUES (?, ?, ?, ?)",
    [name, email, contact, adminId]
  );
  return findByIdRaw(result.insertId);
}

export async function update(id, adminId, { name, email, contact }) {
  await db.query(
    "UPDATE users SET name = ?, email = ?, contact = ? WHERE id = ? AND admin_id = ?",
    [name, email, contact, id, adminId]
  );
  return findById(id, adminId);
}

export async function remove(id, adminId) {
  await db.query("DELETE FROM users WHERE id = ? AND admin_id = ?", [id, adminId]);
}
