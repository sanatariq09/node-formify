const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let nextId = 1;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_REGEX = /^[0-9]+$/;

function validateUser(body) {
  const errors = {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const contact = typeof body.contact === "string" ? body.contact.trim() : "";

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 2 || name.length > 50) {
    errors.name = "Name must be between 2 and 50 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (email.length > 100) {
    errors.email = "Email must be at most 100 characters";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Email must be a valid email address";
  }

  if (!contact) {
    errors.contact = "Contact is required";
  } else if (!CONTACT_REGEX.test(contact)) {
    errors.contact = "Contact must contain numbers only";
  } else if (contact.length < 7 || contact.length > 15) {
    errors.contact = "Contact must be between 7 and 15 characters";
  }

  return { errors, values: { name, email, contact } };
}

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { errors, values } = validateUser(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const user = { id: nextId++, ...values };
  users.push(user);
  res.json(user);
});

app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { errors, values } = validateUser(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  user.name = values.name;
  user.email = values.email;
  user.contact = values.contact;
  res.json(user);
});

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  users = users.filter((u) => u.id !== id);
  res.json({ message: "Deleted" });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
