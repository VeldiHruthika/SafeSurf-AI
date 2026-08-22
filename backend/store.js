// =====================================================
// DATA ACCESS LAYER
// =====================================================
//
// Owner: Friend 4 (Login + Contact) defines WHAT the auth and contact
// features need from storage. Friend 1 (Database + Backend) owns HOW it
// is stored.
//
// The exported function signatures are the contract - keep them stable
// and nothing in server.js or the React app has to change.
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
// -----------------------------------------------------
// CURRENT IMPLEMENTATION: JSON file (a deliberate stopgap)
// -----------------------------------------------------
//
// Data is held in memory and mirrored to .data/store.json after every
// write, then reloaded at boot. That means accounts, sessions and
// contact messages survive a server restart, so you can sign up once
// and stay signed up.
//
// This is NOT meant to be the final storage. It rewrites the whole file
// per write and has no transactions or concurrent-write safety, which is
// fine for a handful of records on one machine and wrong for anything
// larger. When the real database lands, replace the bodies below and
// delete the load/save helpers - nothing outside this file changes.
//
// OTPs are deliberately NOT persisted. They are short-lived (5 minutes)
// and single-use, so losing them on restart is correct behaviour.
// =====================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolved relative to this file, not the working directory, so the
// server finds its data no matter which folder you launch it from.
const DATA_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  ".data"
);

const DATA_FILE = path.join(DATA_DIR, "store.json");

const usersByEmail = new Map();
const sessionsByToken = new Map();
const otpsByEmail = new Map();
const contactMessages = [];

let nextUserId = 1;
let nextMessageId = 1;

// -----------------------------------------------------
// PERSISTENCE
// -----------------------------------------------------

// Read the snapshot written by save(). A missing file is the normal
// first-run case. A corrupt one is reported and then ignored, so a bad
// file can never stop the server from booting.
function load() {
  let snapshot;

  try {
    snapshot = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(
        `Could not read ${DATA_FILE} (${error.message}). Starting empty.`
      );
    }
    return;
  }

  for (const user of snapshot.users ?? []) {
    usersByEmail.set(user.email, user);
  }

  for (const session of snapshot.sessions ?? []) {
    sessionsByToken.set(session.token, session);
  }

  contactMessages.push(...(snapshot.messages ?? []));

  // Derive the id counters from the data itself rather than trusting a
  // stored counter, so hand-editing the file cannot cause collisions.
  nextUserId =
    [...usersByEmail.values()].reduce(
      (max, user) => Math.max(max, user.id ?? 0),
      0
    ) + 1;

  nextMessageId =
    contactMessages.reduce(
      (max, message) => Math.max(max, message.id ?? 0),
      0
    ) + 1;

  console.log(
    `Loaded ${usersByEmail.size} user(s), ${sessionsByToken.size} session(s), ` +
      `${contactMessages.length} message(s) from ${DATA_FILE}`
  );
}

// Write to a temp file and rename over the target. Rename is atomic, so
// a crash mid-write leaves the previous good file intact instead of a
// half-written one.
function save() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    const snapshot = {
      users: [...usersByEmail.values()],
      sessions: [...sessionsByToken.values()],
      messages: contactMessages,
    };

    const tempFile = `${DATA_FILE}.tmp`;

    fs.writeFileSync(tempFile, JSON.stringify(snapshot, null, 2));
    fs.renameSync(tempFile, DATA_FILE);
  } catch (error) {
    // Persistence failing must not take a request down with it. The
    // in-memory copy is still correct for this run.
    console.error(`Could not persist data: ${error.message}`);
  }
}

load();

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
    save();

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
    save();

    return session;
  },

  // SELECT * FROM sessions WHERE token = ?
  async findByToken(token) {
    return sessionsByToken.get(token) ?? null;
  },

  // DELETE FROM sessions WHERE token = ?
  async deleteByToken(token) {
    const deleted = sessionsByToken.delete(token);

    if (deleted) {
      save();
    }

    return deleted;
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
    save();

    return record;
  },

  // SELECT * FROM messages ORDER BY created_at DESC
  async list() {
    return [...contactMessages].reverse();
  },
};
