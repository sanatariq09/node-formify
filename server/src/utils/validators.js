const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_REGEX = /^[0-9]+$/;

export function validateUser(body) {
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

export function validateAuth(body, { requireName } = {}) {
  const errors = {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (requireName) {
    if (!name) {
      errors.name = "Name is required";
    } else if (name.length < 2 || name.length > 50) {
      errors.name = "Name must be between 2 and 50 characters";
    }
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Email must be a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return { errors, values: { name, email, password } };
}
