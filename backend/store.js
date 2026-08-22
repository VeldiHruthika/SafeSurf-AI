// =====================================================
// DATA ACCESS LAYER
// =====================================================
//
// Owner: Friend 4 (Login + Contact) defines WHAT the auth and contact
// features need from storage. Friend 1 (Database + Backend) owns HOW it
// is stored.
//
// Everything below is an in-memory implementation so the login and
// contact flows are testable today. When the real database lands,
// replace the bodies of these functions with queries against it. The
// exported function signatures are the contract - keep them stable and
// nothing in server.js or the React app has to change.
//
// Each function is async on purpose: real database drivers return
// promises, so callers already await. Swapping the implementation will
// not turn into a refactor of every call site.
//
// Tables this module expects Friend 1 to provide:
//
//   users     (id, username, email UNIQUE, mobile, verified, created_at)
//   sessions  (token PK, email, created_at)
//   messages  (id, name, email, message, created_at)
//
// OTPs are deliberately NOT a table. They are short-lived (5 minutes)
// and single-use, so they stay in memory here.
// =====================================================

const usersByEmail = new Map();
const sessionsByToken = new Map();
const otpsByEmail = new Map();
const contactMessages = [];

let nextUserId = 1;
let nextMessageId = 1;

// -----------------------------------------------------
// USERS
// -----------------------------------------------------

export const usersStore = {
  // SELECT * FROM users WHERE email = ?
  async findByEmail(email) {
    return usersByEmail.get(email) ?? null;
  },

  // SELECT 1 FROM users WHERE email = ?
  async existsByEmail(email) {
    return usersByEmail.has(email);
  },

  // INSERT INTO users (...) VALUES (...)
  async create({ username, email, mobile }) {
    const user = {
      id: nextUserId++,
      username,
      email,
      mobile,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    usersByEmail.set(email, user);

    return user;
  },
};

// -----------------------------------------------------
// SESSIONS
// -----------------------------------------------------

export const sessionsStore = {
  // INSERT INTO sessions (token, email) VALUES (?, ?)
  async create({ token, email }) {
    const session = {
      token,
      email,
      createdAt: Date.now(),
    };

    sessionsByToken.set(token, session);

    return session;
  },

  // SELECT * FROM sessions WHERE token = ?
  async findByToken(token) {
    return sessionsByToken.get(token) ?? null;
  },

  // DELETE FROM sessions WHERE token = ?
  async deleteByToken(token) {
    return sessionsByToken.delete(token);
  },
};

// -----------------------------------------------------
// OTPS (in-memory by design - short-lived and single-use)
// -----------------------------------------------------

export const otpStore = {
  async set(email, record) {
    otpsByEmail.set(email, record);

    return record;
  },

  async get(email) {
    return otpsByEmail.get(email) ?? null;
  },

  async delete(email) {
    return otpsByEmail.delete(email);
  },
};

// -----------------------------------------------------
// CONTACT MESSAGES
// -----------------------------------------------------

export const messagesStore = {
  // INSERT INTO messages (name, email, message) VALUES (?, ?, ?)
  async create({ name, email, message }) {
    const record = {
      id: nextMessageId++,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    contactMessages.push(record);

    return record;
  },

  // SELECT * FROM messages ORDER BY created_at DESC
  async list() {
    return [...contactMessages].reverse();
  },
};
