# 🧪 Test Strategy

## Overview
This project uses **end-to-end (E2E)** testing with **Jest**, **Supertest**, and **NestJS Testing Utilities** to validate the core features of the Employee Pulse Survey App, ensuring both API and business logic function as expected.

---

## ✅ Test Scope

### 1. **Authentication (auth.e2e-spec.ts)**
- `/auth/register (POST)` – Register a new user.
- `/auth/login (POST)` – Log in a registered user and verify token/role.

### 2. **Application Flows (app.e2e-spec.ts)**
- `/auth/login (POST)` – User login for access token.
- `/survey (POST)` – Submit a survey response as an authenticated user.
- `/survey (GET)` – Retrieve surveys for logged-in user.
- `/admin/export/csv (GET)` – Export survey data as CSV (admin only).
- `/admin/export/json (GET)` – Export survey data as JSON (admin only).

---

## 🧹 Test Setup & Teardown

- **beforeAll**: Initialize app, clean up users, and pre-seed test users with hashed passwords.
- **afterAll**: Clean up created users and close DB connections.

---

## 🔐 Auth Considerations

- JWT tokens are required for all protected routes.
- Admin-only routes require a user with `role: 'admin'`.

---

## 🧰 Tools Used

- **Jest** – Test runner.
- **Supertest** – HTTP assertions.
- **MongoDB Memory** or real DB (depending on environment).
- **bcrypt** – Password hashing during test setup.

---

## 📁 Location

- Test files are located in the `/test/` directory:
  - `auth.e2e-spec.ts`
  - `app.e2e-spec.ts`

---

## 💡 Note

- Tests are run using `npm run test:e2e`
- Sensitive test user data is isolated and cleaned before/after runs to avoid data conflicts.

