import db from "../config/db.js";

export async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
  return rows[0];
}

export async function create({ name, email, password }) {
  const [result] = await db.query(
    "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return { id: result.insertId, name, email };
}
