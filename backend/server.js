import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import pdf from "pdf-parse";
import fs from "fs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import { GoogleGenAI } from "@google/genai";

import { conditionData } from "./data/conditionData.js";
import {
  usersStore,
  sessionsStore,
  otpStore,
  messagesStore,
} from "./store.js";

// quiet: true suppresses dotenv's tip banner, which otherwise clutters
// the log you read DEV OTP codes from.
dotenv.config({ quiet: true });

const app = express();

// macOS runs AirPlay Receiver on port 5000, which silently steals the
// port and answers requests without CORS headers - the browser then
// reports a generic "Network error". Default to 5050 to stay clear of
// it, and allow an override for anyone who needs a different port.
const PORT = Number(process.env.PORT) || 5050;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());
// =====================================================
// FILE UPLOAD
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =====================================================
// GEMINI SETUP
// =====================================================

const apiKey = process.env.GEMINI_API_KEY;

let ai = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  console.log("Gemini API configured.");
} else {
  console.log(
    "Gemini API key not found. Using fallback analysis."
  );
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SafeSurf AI backend is running.",
  });
});

// =====================================================
// CONDITION MATCHING
// =====================================================

function calculateConditionMatches(selectedSymptoms) {
  const matches = [];

  for (const condition of conditionData) {
    let totalScore = 0;
    let matchedSymptoms = [];

    // -----------------------------------------------
    // Check selected symptoms against condition
    // -----------------------------------------------

    for (const symptom of selectedSymptoms) {
      const weight = condition.symptoms[symptom];

      if (typeof weight === "number") {
        totalScore += weight;
        matchedSymptoms.push(symptom);
      }
    }

    // -----------------------------------------------
    // Ignore conditions with no matching symptoms
    // -----------------------------------------------

    if (matchedSymptoms.length === 0) {
      continue;
    }

    // -----------------------------------------------
    // Calculate coverage
    // -----------------------------------------------

    const symptomCoverage =
      matchedSymptoms.length / selectedSymptoms.length;

    // -----------------------------------------------
    // Calculate average symptom weight
    // -----------------------------------------------

    const averageWeight =
      totalScore / matchedSymptoms.length;

    // -----------------------------------------------
    // Key symptom bonus
    // -----------------------------------------------

    const matchedKeySymptoms =
      matchedSymptoms.filter((symptom) =>
        condition.keySymptoms.includes(symptom)
      );

    const keyCoverage =
      condition.keySymptoms.length > 0
        ? matchedKeySymptoms.length /
          condition.keySymptoms.length
        : 0;

    // -----------------------------------------------
    // Final score
    //
    // 60% = symptom weight
    // 25% = selected symptom coverage
    // 15% = key symptom coverage
    // -----------------------------------------------

    let score =
      averageWeight * 60 +
      symptomCoverage * 25 +
      keyCoverage * 15;

    // -----------------------------------------------
    // Prevent score above 100
    // -----------------------------------------------

    score = Math.min(100, score);

    matches.push({
      name: condition.name,
      specialist: condition.specialist,
      score: Math.round(score),
      matchedSymptoms,
      matchedKeySymptoms,
    });
  }

  // ===================================================
  // SORT HIGHEST MATCH FIRST
  // ===================================================

  matches.sort((a, b) => b.score - a.score);

  // ===================================================
  // RETURN TOP 5
  // ===================================================

  return matches.slice(0, 5);
}

// =====================================================
// FALLBACK ANALYSIS
// =====================================================

function createFallbackAnalysis(
  conditionMatches,
  selectedSymptoms
) {
  // ---------------------------------------------------
  // No matches
  // ---------------------------------------------------

  if (
    !conditionMatches ||
    conditionMatches.length === 0
  ) {
    return {
      description:
        "Your selected symptoms may have several possible causes. The available symptom-matching rules did not identify a strong predefined pattern.",

      recommendation:
        "Consider consulting a General Physician for a proper evaluation, especially if your symptoms persist or worsen.",

      warning_signs: [
        "Symptoms that become severe or suddenly worsen",
        "Difficulty breathing",
        "Loss of consciousness",
        "Severe or persistent pain",
        "High or persistent fever",
      ],
    };
  }

  // ---------------------------------------------------
  // Get strongest match
  // ---------------------------------------------------

  const topCondition = conditionMatches[0];

  const matchedText =
    topCondition.matchedSymptoms &&
    topCondition.matchedSymptoms.length > 0
      ? topCondition.matchedSymptoms.join(", ")
      : selectedSymptoms.join(", ");

  return {
    description:
      `The symptoms you selected (${matchedText}) show the strongest predefined symptom match with ${topCondition.name}. This is only a symptom-pattern match and does not confirm that you have this condition. Similar symptoms can occur with other conditions as well.`,

    recommendation:
      `A ${topCondition.specialist} can evaluate your symptoms and determine whether further examination or testing is needed.`,

    warning_signs: [
      "Symptoms that become severe or suddenly worsen",
      "Difficulty breathing",
      "Loss of consciousness",
      "Severe or persistent pain",
      "High or persistent fever",
    ],
  };
}

// =====================================================
// GEMINI ANALYSIS
// =====================================================

async function generateGeminiAnalysis(
  selectedSymptoms,
  conditionMatches
) {
  // ---------------------------------------------------
  // Gemini unavailable
  // ---------------------------------------------------

  if (!ai) {
    return null;
  }

  // ---------------------------------------------------
  // Prepare top matches
  // ---------------------------------------------------

  const topMatches = conditionMatches
    .slice(0, 3)
    .map(
      (condition) =>
        `${condition.name} (${condition.score}% symptom match)`
    )
    .join(", ");

  // ---------------------------------------------------
  // Prompt
  // ---------------------------------------------------

  const prompt = `
You are providing general health information for SafeSurf AI.

This is NOT a medical diagnosis.

Selected symptoms:
${selectedSymptoms.join(", ")}

Predefined symptom matches:
${topMatches || "No strong predefined matches"}

Return ONLY valid JSON.

Use exactly this structure:

{
  "description": "A short, cautious explanation of what these symptoms may indicate.",
  "recommendation": "A safe recommendation about what type of healthcare professional to consult.",
  "warning_signs": [
    "warning sign 1",
    "warning sign 2",
    "warning sign 3"
  ]
}
Rules:

- Do not diagnose the user.
- Do not prescribe medicines.
- Do not recommend prescription drugs.
- Do not claim that the user definitely has a condition.
- Explain that symptoms can have multiple causes.
- Keep the response concise.
- Recommend professional medical evaluation when appropriate.
`;

  // ---------------------------------------------------
  // Call Gemini
  // ---------------------------------------------------

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      console.log(
        "Gemini returned an empty response."
      );

      return null;
    }

    // -------------------------------------------------
    // Clean Gemini markdown code fences
    // -------------------------------------------------

    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // -------------------------------------------------
    // Parse JSON
    // -------------------------------------------------

    const parsed = JSON.parse(cleanedText);

    return {
      description:
        parsed.description ||
        "Your selected symptoms may have several possible causes.",

      recommendation:
        parsed.recommendation ||
        "Consider consulting a healthcare professional.",

      warning_signs:
        Array.isArray(parsed.warning_signs)
          ? parsed.warning_signs
          : [
              "Symptoms that become severe or suddenly worsen",
              "Difficulty breathing",
              "Loss of consciousness",
            ],
    };
  } catch (error) {
    // -------------------------------------------------
    // Handle Gemini errors
    // -------------------------------------------------

    console.log(
      "Gemini unavailable. Using fallback analysis."
    );

    console.log(
      error?.message || error
    );

    return null;
  }
}
// =====================================================
// REPORT ANALYSIS
// =====================================================

async function analyzeMedicalReport(file) {
  if (!ai) {
    throw new Error("Gemini is unavailable.");
  }

  let reportContent = "";

  // ===================================================
  // PDF
  // ===================================================

  if (file.mimetype === "application/pdf") {
    const pdfData = await pdf(file.buffer);

    reportContent = pdfData.text;
  }

  // ===================================================
  // IMAGE
  // ===================================================

  else {
    const imageBase64 =
      file.buffer.toString("base64");

    const response =
      await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",

        contents: [
          {
            inlineData: {
              mimeType: file.mimetype,
              data: imageBase64,
            },
          },

          `
Analyze this medical report image.

Return ONLY valid JSON.

{
  "summary":"Brief summary",

  "important_values":[
    {
      "name":"Value",
      "result":"Result",
      "status":"Normal"
    }
  ],

  "explanation":"Explain the report in simple language.",

  "recommendations":[
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}

Rules:

- Never diagnose.
- Never prescribe medication.
- Explain medical terms simply.
- Mention whether values are normal, low, or high.
- Recommend consulting a doctor when necessary.
`,
        ],
      });

    const text = response.text
      ?.replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(text);
  }

  // ===================================================
  // PDF ANALYSIS
  // ===================================================

  const response =
    await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",

      contents: `
Analyze this medical report.

Medical report:

${reportContent}

Return ONLY valid JSON.

{
  "summary":"Brief summary",

  "important_values":[
    {
      "name":"Value",
      "result":"Result",
      "status":"Normal"
    }
  ],

  "explanation":"Explain the report in simple language.",

  "recommendations":[
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}

Rules:

- Never diagnose.
- Never prescribe medication.
- Explain medical terms simply.
- Mention whether values are normal, low, or high.
- Recommend consulting a doctor when necessary.
`,
    });

  const text = response.text
    ?.replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(text);
}
// =====================================================
// REPORT ANALYSIS API
// =====================================================

app.post(
  "/api/report-analyze",
  upload.single("report"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Please upload a file.",
        });
      }

      const analysis =
        await analyzeMedicalReport(
          req.file
        );

      return res.json({
        success: true,
        analysis,
      });

    } catch (error) {
      console.error(
        "Report analysis error:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to analyze the report.",
      });
    }
  }
);

// =====================================================
// ANALYZE API
// =====================================================

app.post("/api/analyze", async (req, res) => {
  try {
    const { symptoms } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!Array.isArray(symptoms)) {
      return res.status(400).json({
        success: false,
        error:
          "Symptoms must be provided as an array.",
      });
    }

    // =================================================
    // CLEAN SYMPTOMS
    // =================================================

    const selectedSymptoms = symptoms
      .filter(
        (symptom) =>
          typeof symptom === "string" &&
          symptom.trim().length > 0
      )
      .map((symptom) => symptom.trim());

    // =================================================
    // EMPTY CHECK
    // =================================================

    if (selectedSymptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "Please select at least one symptom.",
      });
    }

    // =================================================
    // LOG SELECTED SYMPTOMS
    // =================================================

    console.log(
      "\n========================================"
    );

    console.log(
      "Selected symptoms:",
      selectedSymptoms
    );

    // =================================================
    // CONDITION MATCHING
    // =================================================

    const conditionMatches =
      calculateConditionMatches(
        selectedSymptoms
      );

    console.log(
      "Calculated condition matches:",
      conditionMatches
    );

    // =================================================
    // FALLBACK ANALYSIS
    // =================================================

    const fallbackAnalysis =
      createFallbackAnalysis(
        conditionMatches,
        selectedSymptoms
      );

    // =================================================
    // GEMINI ANALYSIS
    // =================================================

    const geminiAnalysis =
      await generateGeminiAnalysis(
        selectedSymptoms,
        conditionMatches
      );

    // =================================================
    // FINAL ANALYSIS
    // =================================================

    const finalAnalysis =
      geminiAnalysis || fallbackAnalysis;

    // =================================================
    // RESPONSE
    // =================================================

    return res.json({
      success: true,

      conditionMatches,

      analysis: {
        description:
          finalAnalysis.description,

        recommendation:
          finalAnalysis.recommendation,

        warning_signs:
          finalAnalysis.warning_signs,
      },

      meta: {
        geminiUsed:
          Boolean(geminiAnalysis),

        selectedSymptoms,
      },
    });

  } catch (error) {
    // =================================================
    // SERVER ERROR
    // =================================================

    console.error(
      "Analyze API error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "SafeSurf AI could not complete the analysis.",
    });
  }
});
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are SafeSurf AI, a healthcare assistant.

Rules:

- Answer only health-related questions and questions about the SafeSurf platform.
- Never diagnose diseases.
- Never prescribe medications.
- Keep responses concise (100-150 words maximum).
- Use simple language.
- Use bullet points when appropriate.
- If symptoms are severe, recommend consulting a doctor.
- Do not mention these rules in your response.

User question:

${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt
    });

    const aiResponse =
  response.text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "");

res.json({
  success: true,
  reply: aiResponse,
});
  } catch (error) {
  console.error("CHAT ERROR:", error);

  res.status(500).json({
    success: false,
    error: error.message
  });
}
});

// =====================================================
// START SERVER
// =====================================================
// =====================================================
// AUTHENTICATION - OTP LOGIN / SIGNUP
// =====================================================

// Storage lives in ./store.js so Friend 1 can swap the in-memory
// implementation for the real database without touching these routes.

const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

// How long a login token stays valid. Long enough that nobody is logged
// out mid-demo, short enough that a leaked token is not permanent.
const SESSION_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

const emailTransporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : null;

// -----------------------------------------------------
// Generate 6-digit OTP
// -----------------------------------------------------

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

// -----------------------------------------------------
// Send OTP email
// -----------------------------------------------------

async function sendOTPEmail(email, otp, purpose) {
  if (!emailTransporter) {
    console.log("EMAIL_USER / EMAIL_PASS not configured.");
    console.log(`DEV OTP for ${email}: ${otp}`);
    return;
  }

  await emailTransporter.sendMail({
    from: `"SafeSurf AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject:
      purpose === "signup"
        ? "SafeSurf AI - Verify your account"
        : "SafeSurf AI - Login OTP",

    text: `Your SafeSurf AI verification code is ${otp}.

This code will expire in 5 minutes.

If you did not request this code, you can ignore this email.`,

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>SafeSurf AI</h2>

        <p>Your verification code is:</p>

        <h1 style="letter-spacing: 6px;">
          ${otp}
        </h1>

        <p>This code will expire in <strong>5 minutes</strong>.</p>

        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });
}

// -----------------------------------------------------
// SIGNUP - Send OTP
// -----------------------------------------------------

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, mobile } = req.body;

    if (!username || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Username, email and mobile are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    // Check whether account already exists
    if (await usersStore.existsByEmail(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const otp = generateOTP();

    await otpStore.set(normalizedEmail, {
      otp,
      type: "signup",
      username,
      email: normalizedEmail,
      mobile,
      expiresAt: Date.now() + OTP_EXPIRY,
      attempts: 0,
    });

    await sendOTPEmail(
      normalizedEmail,
      otp,
      "signup"
    );

    return res.json({
      success: true,
      message: "Verification code sent to your email.",
    });

  } catch (error) {
    console.error("SIGNUP OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not send verification code.",
    });
  }
});

// -----------------------------------------------------
// SIGNUP - Verify OTP
// -----------------------------------------------------

app.post("/api/auth/signup/verify", async (req, res) => {
  try {
    const {
      username,
      email,
      mobile,
      otp,
    } = req.body;

    const normalizedEmail =
      email?.trim().toLowerCase();

    const record = await otpStore.get(normalizedEmail);

    if (!record || record.type !== "signup") {
      return res.status(404).json({
        success: false,
        message: "No signup verification request found.",
      });
    }

    if (Date.now() > record.expiresAt) {
      await otpStore.delete(normalizedEmail);

      return res.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.otp !== String(otp)) {
      record.attempts += 1;

      if (record.attempts >= 5) {
        await otpStore.delete(normalizedEmail);

        return res.status(429).json({
          success: false,
          message: "Too many incorrect attempts.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Create account
    await usersStore.create({
      username: username || record.username,
      email: normalizedEmail,
      mobile: mobile || record.mobile,
    });

    await otpStore.delete(normalizedEmail);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });

  } catch (error) {
    console.error("SIGNUP VERIFY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create account.",
    });
  }
});

// -----------------------------------------------------
// LOGIN - Send OTP
// -----------------------------------------------------

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await usersStore.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first.",
      });
    }

    const otp = generateOTP();

    await otpStore.set(normalizedEmail, {
      otp,
      type: "login",
      email: normalizedEmail,
      expiresAt: Date.now() + OTP_EXPIRY,
      attempts: 0,
    });

    await sendOTPEmail(
      normalizedEmail,
      otp,
      "login"
    );

    return res.json({
      success: true,
      message: "Login OTP sent to your email.",
    });

  } catch (error) {
    console.error("LOGIN OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not send login code.",
    });
  }
});

// -----------------------------------------------------
// LOGIN - Verify OTP
// -----------------------------------------------------

app.post("/api/auth/login/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const normalizedEmail =
      email?.trim().toLowerCase();

    const record = await otpStore.get(normalizedEmail);

    if (!record || record.type !== "login") {
      return res.status(404).json({
        success: false,
        message: "No login OTP request found.",
      });
    }

    if (Date.now() > record.expiresAt) {
      await otpStore.delete(normalizedEmail);

      return res.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.otp !== String(otp)) {
      record.attempts += 1;

      if (record.attempts >= 5) {
        await otpStore.delete(normalizedEmail);

        return res.status(429).json({
          success: false,
          message: "Too many incorrect attempts.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    const user = await usersStore.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Generate login token
    const token = crypto.randomBytes(32).toString("hex");

    await sessionsStore.create({
      token,
      email: normalizedEmail,
    });

    await otpStore.delete(normalizedEmail);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      },
    });

  } catch (error) {
    console.error("LOGIN VERIFY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not verify login.",
    });
  }
});

// -----------------------------------------------------
// SESSION - Resolve the logged-in user from a token
// -----------------------------------------------------
//
// Reads the "Authorization: Bearer <token>" header and returns the
// matching user, so the React app can restore the signed-in state after
// a refresh instead of trusting whatever sits in localStorage.

async function getUserFromRequest(req) {
  const header = req.headers.authorization ?? "";

  if (!header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    return null;
  }

  const session = await sessionsStore.findByToken(token);

  if (!session) {
    return null;
  }

  // Tokens are not valid forever. An expired one is removed on sight so
  // it cannot be replayed, and the caller is treated as signed out.
  if (Date.now() - (session.createdAt ?? 0) > SESSION_TTL) {
    await sessionsStore.deleteByToken(token);

    return null;
  }

  const user = await usersStore.findByEmail(session.email);

  if (!user) {
    return null;
  }

  return { token, user };
}

app.get("/api/auth/me", async (req, res) => {
  try {
    const resolved = await getUserFromRequest(req);

    if (!resolved) {
      return res.status(401).json({
        success: false,
        message: "Not signed in.",
      });
    }

    return res.json({
      success: true,
      user: {
        username: resolved.user.username,
        email: resolved.user.email,
        mobile: resolved.user.mobile,
      },
    });

  } catch (error) {
    console.error("AUTH ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load your account.",
    });
  }
});

// -----------------------------------------------------
// LOGOUT - Destroy the session
// -----------------------------------------------------

app.post("/api/auth/logout", async (req, res) => {
  try {
    const resolved = await getUserFromRequest(req);

    if (resolved) {
      await sessionsStore.deleteByToken(resolved.token);
    }

    // Always report success: logging out of an already-expired session
    // is not an error from the user's point of view.
    return res.json({
      success: true,
      message: "Logged out.",
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not log out.",
    });
  }
});

// =====================================================
// CONTACT
// =====================================================

const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body ?? {};

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    // -------------------------------------------------
    // Validation - mirrors the checks in Contact.jsx so
    // a direct API call cannot bypass them
    // -------------------------------------------------

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Name must be ${MAX_NAME_LENGTH} characters or fewer.`,
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      });
    }

    const saved = await messagesStore.create({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });

    console.log(
      `CONTACT MESSAGE #${saved.id} from ${trimmedEmail}`
    );

    // Notify the support inbox when email is configured. A delivery
    // failure must not lose the message - it is already stored - so the
    // send is best-effort and only logged.
    if (emailTransporter) {
      try {
        await emailTransporter.sendMail({
          from: `"SafeSurf AI" <${process.env.EMAIL_USER}>`,
          to: process.env.CONTACT_INBOX ?? process.env.EMAIL_USER,
          replyTo: trimmedEmail,
          subject: `SafeSurf AI - New contact message from ${trimmedName}`,
          text: `From: ${trimmedName} <${trimmedEmail}>\n\n${trimmedMessage}`,
        });
      } catch (mailError) {
        console.error("CONTACT EMAIL ERROR:", mailError);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Thanks! Your message has been received.",
    });

  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not send your message. Please try again.",
    });
  }
});

// -----------------------------------------------------
// Read stored messages (for whoever builds the admin view)
// -----------------------------------------------------

app.get("/api/contact/messages", async (req, res) => {
  try {
    const messages = await messagesStore.list();

    return res.json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    console.error("CONTACT LIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load messages.",
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

// Express 5 runs the listen() callback even when the bind fails, which
// would print a "running at" line immediately before the port error.
// The server's own "listening" event only fires on a successful bind.
const server = app.listen(PORT);

server.on("listening", () => {
  console.log(
    `SafeSurf AI backend running at http://localhost:${PORT}`
  );
});

// Without this, a taken port throws an unhandled error and the crash
// says nothing useful about what to actually do.
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use.\n\n` +
        `  - Another copy of this server may still be running.\n` +
        `  - On macOS, port 5000 is used by AirPlay Receiver\n` +
        `    (System Settings > General > AirDrop & Handoff).\n\n` +
        `Start on a different port with:  PORT=5051 node server.js\n` +
        `and set VITE_API_URL to match in safesurf-ai/.env\n`
    );

    process.exit(1);
  }

  throw error;
});