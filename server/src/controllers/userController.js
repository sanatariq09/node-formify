import * as userModel from "../models/userModel.js";
import { validateUser } from "../utils/validators.js";

export async function getUsers(req, res) {
  const users = await userModel.getAll(req.admin.id);
  res.json(users);
}

export async function createUser(req, res) {
  const { errors, values } = validateUser(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const user = await userModel.create(req.admin.id, values);
  res.json(user);
}

export async function updateUser(req, res) {
  const id = Number(req.params.id);
  const existing = await userModel.findById(id, req.admin.id);
  if (!existing) return res.status(404).json({ message: "User not found" });

  const { errors, values } = validateUser(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const user = await userModel.update(id, req.admin.id, values);
  res.json(user);
}

export async function deleteUser(req, res) {
  const id = Number(req.params.id);
  await userModel.remove(id, req.admin.id);
  res.json({ message: "Deleted" });
}
