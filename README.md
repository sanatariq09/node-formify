Formify

Formify is a full-stack User Management System built with **React.js, Node.js, Express.js, and MySQL.

## Features

* Admin Register & Login
* JWT Authentication
* Password Hashing with bcrypt
* User CRUD Operations
* MySQL Database Integration
* Email & Contact Validation
* Axios API Integration
* Protected Routes
* Responsive UI

## Technologies

Frontend: React.js, Vite, Axios, Tailwind CSS
Backend: Node.js, Express.js, JWT, bcryptjs
Database: MySQL

## Setup

### Backend

bash
cd server
npm install
npm run migrate
npm run dev


Create a `.env` file inside the `server` folder:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=formify
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

### Frontend

Open another terminal:

bash
cd client
npm install
npm run dev


Frontend normally runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5001
```

## API

* POST /api/auth/register` — Register Admin
* POST /api/auth/login` — Admin Login
* GET /api/users` — Get Users
* POST /api/users` — Create User
* PUT /api/users/:id` — Update User
* DELETE /api/users/:id` — Delete User
