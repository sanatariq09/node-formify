import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as adminModel from "../models/adminModel.js";
import { validateAuth } from "../utils/validators.js";

function signToken(admin) {
  return jwt.sign(
    { id: admin.id, name: admin.name, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

export async function register(req, res) {
  const { errors, values } = validateAuth(req.body, { requireName: true });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const existing = await adminModel.findByEmail(values.email);
  if (existing) {
    return res.status(400).json({ errors: { email: "Email is already registered" } });
  }

  const hashed = await bcrypt.hash(values.password, 10);
  const admin = await adminModel.create({ ...values, password: hashed });
  const token = signToken(admin);
  res.json({ token, admin });
}

export async function login(req, res) {
  const { errors, values } = validateAuth(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const admin = await adminModel.findByEmail(values.email);
  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(values.password, admin.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(admin);
  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
}
