import mysql from "mysql2/promise";
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function run() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  const setup = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
  });
  await setup.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await setup.end();

  const db = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [applied] = await db.query("SELECT name FROM migrations");
  const appliedNames = new Set(applied.map((row) => row.name));

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  let ranAny = false;

  for (const file of files) {
    if (appliedNames.has(file)) continue;

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    await db.query(sql);
    await db.query("INSERT INTO migrations (name) VALUES (?)", [file]);
    console.log(`Applied ${file}`);
    ranAny = true;
  }

  if (!ranAny) console.log("Nothing to migrate, already up to date");

  await db.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
