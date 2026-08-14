import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import pdf from "pdf-parse";
import fs from "fs";

import { GoogleGenAI } from "@google/genai";

import { conditionData } from "./data/conditionData.js";

dotenv.config();

const app = express();
const PORT = 5000;

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

app.listen(PORT, () => {
  console.log(
    `SafeSurf AI backend running at http://localhost:${PORT}`
  );
});