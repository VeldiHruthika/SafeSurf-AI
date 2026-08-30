import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import pdf from "pdf-parse";
import fs from "fs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";

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
IMPORTANT SAFETY AND MEDICAL RESPONSE RULES:

1. Do NOT diagnose the user or state that a specific disease or condition is the likely cause.

2. In "Possible General Causes", describe only general possibilities.
Do not present a condition as a conclusion or diagnosis.

3. Always use cautious wording such as:
"Some possible explanations include..."
or
"These symptoms can sometimes be associated with..."

4. If the reported symptoms contain potentially concerning combinations
such as:
- a new lump with bloody or unusual discharge
- sudden weakness or numbness
- severe or rapidly worsening pain
- difficulty breathing
- chest pain with pain spreading to the arm or jaw
- heavy or unexplained bleeding

clearly recommend prompt professional medical evaluation.

5. For concerning symptoms, do NOT simply say:
"Schedule an appointment when convenient."

Instead use language such as:
"Please arrange prompt medical evaluation rather than waiting
to see if the symptoms resolve on their own."

6. Do not create unnecessary fear or claim that the user has a serious disease.
Explain that concerning symptoms can have different causes and
that an examination or appropriate testing may be needed to
determine the cause.

7. Emergency warnings should only be given when symptoms suggest
a possible emergency.

Return the response strictly in the requested JSON format.
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

const REPORT_JSON_INSTRUCTIONS = `
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
`;

// Minimum number of extracted characters before we trust pdf-parse's
// text layer. Scanned/"printed to PDF" images produce 0 (or near-0)
// characters even though the mimetype says application/pdf.
const MIN_PDF_TEXT_LENGTH = 40;

// ===================================================
// Render every page of a PDF buffer to base64 PNG images.
// Used for scanned/image-only PDFs that have no text layer.
// ===================================================

async function renderPdfToImages(buffer, maxPages = 5) {
  const uint8Data = new Uint8Array(buffer);
  const doc = await getDocument({ data: uint8Data }).promise;
  const pageCount = Math.min(doc.numPages, maxPages);

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    await page.render({ canvasContext: context, viewport }).promise;

    const pngBuffer = await canvas.encode("png");
    images.push(pngBuffer.toString("base64"));
  }

  return images;
}

// ===================================================
// Send one or more images (as base64 PNG/JPEG) to Gemini
// and parse the structured JSON response.
// ===================================================

async function analyzeReportImages(imagesBase64, mimeType = "image/png") {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",

    contents: [
      ...imagesBase64.map((data) => ({
        inlineData: { mimeType, data },
      })),

      `Analyze this medical report image.\n${REPORT_JSON_INSTRUCTIONS}`,
    ],
  });

  const text = response.text
    ?.replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(text);
}

async function analyzeMedicalReport(file) {
  if (!ai) {
    throw new Error("Gemini is unavailable.");
  }

  // ===================================================
  // PDF
  // ===================================================

  if (file.mimetype === "application/pdf") {
    const pdfData = await pdf(file.buffer);
    const reportContent = (pdfData.text || "").trim();

    // Case 1: PDF has a real text layer (e.g. digitally generated
    // lab report) — analyze it as text like before.
    if (reportContent.length >= MIN_PDF_TEXT_LENGTH) {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",

        contents: `
Analyze this medical report.

Medical report:

${reportContent}
${REPORT_JSON_INSTRUCTIONS}`,
      });

      const text = response.text
        ?.replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

      return JSON.parse(text);
    }

    // Case 2: No usable text layer — this is a scanned image
    // (or a photo) saved/exported as a PDF, like "R8.jpg.pdf".
    // Render the page(s) to images and reuse the image pipeline.
    console.log(
      `No text layer found in "${file.originalname}" — rendering as image instead.`
    );

    const images = await renderPdfToImages(file.buffer);

    if (images.length === 0) {
      throw new Error("Could not render any pages from this PDF.");
    }

    return analyzeReportImages(images, "image/png");
  }

  // ===================================================
  // IMAGE
  // ===================================================

  const imageBase64 = file.buffer.toString("base64");
  return analyzeReportImages([imageBase64], file.mimetype);
}
// =====================================================
// MEDICAL REPORT ANALYZER API
// SUPPORTS MULTIPLE REPORTS
// =====================================================

app.post(
  "/api/report-analyze",
  upload.array("reports", 10),

  async (req, res) => {

    try {

      // ---------------------------------------------
      // CHECK FILES
      // ---------------------------------------------

      if (
        !req.files ||
        req.files.length === 0
      ) {

        return res.status(400).json({
          success: false,
          error: "Please upload at least one medical report.",
        });

      }


      console.log(
        `Received ${req.files.length} medical report(s).`
      );


      // ---------------------------------------------
      // ANALYZE ALL REPORTS
      // ---------------------------------------------

      const analyses = [];

      for (const file of req.files) {

        try {

          console.log(
            `Analyzing report: ${file.originalname}`
          );


          const analysis =
            await analyzeMedicalReport(file);


          analyses.push({

            fileName:
              file.originalname,

            analysis:
              analysis,

          });

        }

        catch (fileError) {

          console.error(
            `Error analyzing ${file.originalname}:`,
            fileError
          );


          analyses.push({

            fileName:
              file.originalname,

            analysis: {
              summary:
                "This report could not be analyzed.",

              important_values: [],

              explanation:
                "The AI was unable to process this report.",

              recommendations: [],

            },

          });

        }

      }


      // ---------------------------------------------
      // RETURN COMBINED ANALYSIS
      // ---------------------------------------------

      return res.json({

        success: true,

        analysis: {

          reports:
            analyses,

          // Keep these fields for compatibility
          // with your existing Step 3 UI

          summary:
            analyses
              .map(
                (item) =>
                  `${item.fileName}: ${item.analysis?.summary || ""}`
              )
              .join("\n\n"),

          important_values:
            analyses.flatMap(
              (item) =>
                item.analysis?.important_values || []
            ),

          explanation:
            analyses
              .map(
                (item) =>
                  item.analysis?.explanation || ""
              )
              .filter(Boolean)
              .join("\n\n"),

          recommendations:
            analyses.flatMap(
              (item) =>
                item.analysis?.recommendations || []
            ),

        },

      });

    }

    catch (error) {

      console.error(
        "Report analysis error:",
        error
      );


      return res.status(500).json({

        success: false,

        error:
          "Failed to analyze the medical reports.",

      });

    }

  }
);


// =====================================================
// PERSONALIZED CARE PLAN API
// =====================================================

app.post("/api/generate-care-plan", async (req, res) => {
  console.log("🔥 CARE PLAN ROUTE HIT");
console.log("Received data:", req.body);
  try {
    // =================================================+
    // CHECK AI SERVICE
    // =================================================

    if (!ai) {
      return res.status(503).json({
        success: false,
        error:
          "AI service is currently unavailable. Please try again later.",
      });
    }

    // =================================================
    // RECEIVE CARE PLANNER DATA
    // =================================================

    const {
      age,
      gender,
      height,
      weight,
      financialLevel,
      dietaryPreference,
      occupation,
      workType,
      workload,

      knownConditions,
      customCondition,
      symptoms,
      medications,
      allergies,
      previousSurgeries,
      medicalHistory,

      reportAnalysis,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!age || !gender) {
      return res.status(400).json({
        success: false,
        error: "Age and gender are required.",
      });
    }

    // =================================================
    // CLEAN DATA
    // =================================================

    const cleanConditions = Array.isArray(knownConditions)
      ? knownConditions
          .filter(
            (condition) =>
              typeof condition === "string" &&
              condition.trim().length > 0
          )
          .map((condition) => condition.trim())
      : [];

    const cleanSymptoms =
      typeof symptoms === "string"
        ? symptoms.trim()
        : "";

    const cleanMedications =
      typeof medications === "string"
        ? medications.trim()
        : "";

    const cleanAllergies =
      typeof allergies === "string"
        ? allergies.trim()
        : "";

    const cleanSurgeries =
      typeof previousSurgeries === "string"
        ? previousSurgeries.trim()
        : "";

    const cleanMedicalHistory =
      typeof medicalHistory === "string"
        ? medicalHistory.trim()
        : "";

    // =================================================
    // REPORT INFORMATION
    // =================================================

    let reportContext =
      "No medical report was uploaded or analyzed.";

    if (
      reportAnalysis &&
      typeof reportAnalysis === "object"
    ) {
      reportContext = JSON.stringify(
        reportAnalysis,
        null,
        2
      );
    }

    // =================================================
    // BMI CALCULATION (done in code, not left to the AI)
    // =================================================

    let bmiValue = null;
    let bmiCategory = "Not calculable";

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (
      heightNum &&
      weightNum &&
      heightNum > 0 &&
      weightNum > 0
    ) {
      const heightMeters = heightNum / 100;
      bmiValue =
        Math.round(
          (weightNum / (heightMeters * heightMeters)) * 10
        ) / 10;

      if (bmiValue < 18.5) bmiCategory = "Underweight";
      else if (bmiValue < 25) bmiCategory = "Normal range";
      else if (bmiValue < 30) bmiCategory = "Overweight range";
      else bmiCategory = "Obesity range";
    }

    // =================================================
    // USER HEALTH PROFILE
    // =================================================

    const userProfile = `
Age: ${age}

Gender: ${gender}

Height: ${height || "Not provided"} cm

Weight: ${weight || "Not provided"} kg

Calculated BMI: ${
      bmiValue !== null
        ? `${bmiValue} (${bmiCategory})`
        : "Not calculable from provided data"
    }

Financial level: ${
      financialLevel || "Not provided"
    }

Dietary preference: ${
      dietaryPreference || "Not provided"
    }

Occupation: ${
      occupation || "Not provided"
    }

Work type: ${
      workType || "Not provided"
    }

Workload: ${
      workload || "Not provided"
    }

Known conditions:
${
      cleanConditions.length > 0
        ? cleanConditions.join(", ")
        : "None reported"
    }

Additional condition:
${
      customCondition?.trim() ||
      "None"
    }

Current symptoms:
${
      cleanSymptoms ||
      "None reported"
    }

Current medications:
${
      cleanMedications ||
      "None reported"
    }

Allergies:
${
      cleanAllergies ||
      "None reported"
    }

Previous surgeries:
${
      cleanSurgeries ||
      "None reported"
    }

Medical history:
${
      cleanMedicalHistory ||
      "None reported"
    }

Medical report analysis:
${reportContext}
`;

    // =================================================
    // GEMINI PROMPT
    // =================================================

    const prompt = `
You are SafeSurf AI, an educational healthcare and wellness assistant serving users in India.

Produce a structured PERSONAL HEALTH ASSESSMENT AND GUIDANCE REPORT for this specific person. This is NOT a medical diagnosis and must not replace professional medical care.

USER PROFILE:
${userProfile}

=====================================================
MOST IMPORTANT INSTRUCTION — READ THIS FIRST
=====================================================

The free-text fields above ("Current symptoms", "Medical history", etc.) usually contain the richest, most clinically relevant information — patterns, timing, triggers, severity, and things the user noticed themselves (e.g. "my cycles got more regular when I walked more"). This is often MORE important than the checkbox "Known conditions" list.

Before writing any output, actually read and reason through the free-text symptom description sentence by sentence. Identify:
- What the core pattern is (not just a list of symptoms, but how they relate to each other and over time)
- Anything the user noticed themselves about triggers or what helped/worsened things
- Anything that sounds like it deserves a specific type of medical evaluation

"healthAssessment" and "primaryConcerns" are the most important sections of this whole report. They must NOT be generic. They must reference the specific things this person actually described. If the user wrote a detailed symptom narrative and your "healthAssessment" or "primaryConcerns" could apply to literally anyone, you have failed the task — rewrite it grounded in their actual words.

=====================================================
SAFETY RULES
=====================================================

1. Do NOT diagnose the user or state a condition is confirmed ("You have PCOS" is forbidden). Instead: "Persistent irregular cycles may warrant evaluation for hormonal or ovulatory causes such as PCOS, depending on clinical assessment."
2. Do NOT prescribe medicines, dosages, or tell the user to start/stop/change any prescribed medication.
3. Use cautious, non-alarming language.
4. Never say the user "needs" a specific treatment or surgery. Frame as "a clinician may discuss...".
5. For "procedureCostEstimates", give only broad approximate INR ranges typical for private hospitals in India, explicitly labeled as rough estimates that vary by hospital/city/insurance. If not reasonably confident, omit rather than invent.
6. For "yoga", exclude or clearly caveat poses contraindicated by reported conditions (cardiac issues, uncontrolled hypertension, pregnancy, recent surgery, acute spinal issues).
7. If genuinely concerning/emergency-type patterns are present, say so clearly in "seekEarlierCareIf".
8. Respect the user's financial level — prefer practical, affordable suggestions.
9. Adapt all meal suggestions to realistic Indian food patterns (dal, roti, sabzi, idli, upma, curd, seasonal vegetables) unless the profile suggests otherwise. Strictly respect the user's stated "Dietary preference" — never suggest meat, fish, or eggs to someone who reported "vegetarian" or "vegan", never suggest dairy or other animal products to someone who reported "vegan", and if dietary preference is "Not provided", default to vegetarian-friendly options with any non-vegetarian items clearly optional/substitutable.
10. Do not invent information the user did not provide.
11. Do not leave "healthAssessment", "primaryConcerns", "priorities", "dailyRoutine", "physicalActivity", "sleepAndRecovery", and "stressManagement" empty — these must always be filled using whatever information is available, even if conditions/symptoms are minimal.
12. NEVER state or imply that something the user did (a habit, food, activity) CAUSED a health outcome, even if the user themselves noticed a correlation. If the user reports noticing that a symptom seemed to improve or worsen alongside a habit, reflect that back as their own observation only — e.g. "You noticed your cycles were more predictable during periods of regular activity" — and immediately note that this is a personal observation, not an established cause, and does not replace medical evaluation of the underlying pattern. Do NOT tell the user to "keep doing X because it appears to regulate/fix Y."
13. For reported deficiencies (e.g. Vitamin D, calcium, iron, anemia): do not just give general lifestyle/diet tips as if that resolves the deficiency, and do NOT describe the nutrient's general importance in a way that implies it explains an unrelated symptom the user reported (e.g. do not say "these nutrients are critical for hormonal balance" if the user also reported menstrual symptoms — that implies a causal link you have not established). Instead, state plainly what the nutrient generally supports (e.g. bone/overall health), and separately note that confirmed deficiencies should be managed according to a clinician's advice, and that diet/sunlight are supportive measures alongside — not a substitute for — medically directed treatment.
14. Clearly separate three categories throughout the report and never blur them together: (a) conditions the user explicitly told you they have been diagnosed with — treat these as confirmed facts, not something to re-evaluate; (b) symptoms the user reported experiencing — these are observations, not conclusions; (c) possible areas for medical evaluation — these are your cautious suggestions of what a clinician might look into, clearly framed as speculative. Never present (b) or (c) as if they were (a).
15. Do not suggest rare or exotic diseases/conditions unless the reported symptom pattern genuinely and specifically points that direction. Default to the most common, well-established explanations for a symptom pattern before mentioning anything rare. If you're not reasonably confident a possible evaluation area is relevant, omit it rather than listing it "just in case."
16. Where there is genuine medical uncertainty (which is most of the time, since you only have self-reported information), say so plainly rather than sounding falsely confident — e.g. "this pattern can have several different explanations, and only a clinical evaluation can narrow it down," rather than stating one explanation as if it were most likely.
17. This rule applies to every section, not just healthAssessment/primaryConcerns: avoid generic wellness filler ("drink more water", "get enough sleep", "try to relax") unless it is tied to something concrete in this person's actual profile (their reported activity level, work pattern, symptoms, or conditions). If a recommendation would read identically for any random user, make it more specific and practical, or remove it.
18. Avoid phrases like "indicative of [condition]" or "symptoms of [condition]" when describing a symptom pattern — these read as a confirmed diagnosis even when unintended. Prefer "consistent with a pattern of [description]" (e.g. "consistent with a pattern of severe menstrual pain (dysmenorrhea)" rather than "indicative of severe dysmenorrhea").
19. Avoid "to rule out [condition A] or [condition B]" when describing why an evaluation may help — "rule out" implies those specific diagnoses are already the leading suspects. Prefer framing evaluation purpose broadly first, then naming possible conditions as examples contingent on findings — e.g. "to help assess for possible hormonal, structural, or other gynecological causes, which may include conditions such as PCOS or endometriosis depending on clinical findings" rather than "to rule out structural or functional concerns like PCOS or endometriosis."
20. The calculated BMI (see "Calculated BMI" in the profile above) is a derived metric, not a clinical diagnosis. Consider it alongside — not as a replacement for — any weight-related condition the user reported. If a user-reported weight-related condition seems to conflict with the calculated BMI (e.g. the BMI category doesn't obviously match a reported condition), do not present the reported condition as clinically confirmed or resolved by the BMI number either way. Use neutral wording (e.g. "your reported [condition] and calculated BMI category should both be considered by a clinician during assessment") and recommend professional assessment rather than reconciling the discrepancy yourself.

=====================================================
JSON FORMAT — return ONLY this structure, valid JSON, no markdown, no code fences
=====================================================

{
  "healthAssessment": "2-4 sentence assessment written specifically about THIS person's reported pattern of symptoms/conditions — must reference specifics they actually described, not generic wellness language.",

  "primaryConcerns": [
    {
      "concern": "Short name, e.g. 'Menstrual irregularity and severe dysmenorrhea'",
      "severity": "Low | Moderate | High — how much day-to-day attention this pattern warrants",
      "details": "A paragraph analyzing THIS specific pattern using the user's own reported details (timing, triggers, associated symptoms, what they noticed helped/worsened it). If the user reported a personal observation about what seemed to help, reflect it as their observation, not a confirmed cause."
    }
  ],

  "possibleEvaluationAreas": [
    { "concern": "Short concern name", "evaluationFocus": "What kind of evaluation this may warrant, cautiously worded (e.g. 'Gynecological evaluation for hormonal or ovulatory causes')" }
  ],

  "recommendedSpecialists": [
    { "specialist": "e.g. Gynecologist", "reason": "Why, tied specifically to this user's reported symptoms" }
  ],

  "seekEarlierCareIf": ["Specific red-flag sign that should prompt earlier/urgent medical attention"],

  "possibleTestsToDiscuss": ["Test/investigation name a clinician may consider, only if grounded in what the user reported"],

  "priorities": ["Top 3-5 priorities, most important first"],

  "dailyRoutine": [
    { "time": "Morning", "activities": ["Practical activity", "Practical activity"] },
    { "time": "Afternoon", "activities": ["Practical activity", "Practical activity"] },
    { "time": "Evening", "activities": ["Practical activity", "Practical activity"] },
    { "time": "Night", "activities": ["Practical activity", "Practical activity"] }
  ],

  "nutrition": {
    "guidance": ["General nutrition guidance point relevant to this profile"],
    "breakfastOptions": ["Realistic Indian breakfast option"],
    "lunchOptions": ["Realistic lunch option"],
    "dinnerOptions": ["Realistic dinner option"],
    "snackOptions": ["Realistic snack option"],
    "foodsToLimit": ["Specific food/group to limit, with brief reason if relevant"],
    "conditionSpecificGuidance": [
      { "condition": "Condition or deficiency name", "encourage": ["Food to favor"], "limit": ["Food to limit"] }
    ]
  },

  "physicalActivity": {
    "currentRecommendation": ["What activity level is appropriate right now, given this person's profile and any limitations — specific, not generic"],
    "beginnerPlan": ["Concrete starting-point activity for the first 1-2 weeks"],
    "progression": ["How to build up from there over the following weeks, once the starting level feels manageable"],
    "precautions": ["Activity to avoid or modify, with a brief reason — only if medically relevant"]
  },

  "yoga": [
    { "name": "Actual pose name (e.g. Balasana, Supta Baddha Konasana, Cat-Cow, Bhujangasana)", "duration": "e.g. 30-60 seconds x 2-3 rounds", "frequency": "e.g. Daily, or 3-4 times a week", "purpose": "What it may support", "precaution": "Who should avoid/modify it, or 'None specific to your profile.'" }
  ],

  "sleepAndRecovery": ["Sleep or recovery suggestion"],

  "stressManagement": ["Stress management suggestion"],

  "treatmentInformation": [
    {
      "condition": "Condition name (only where discussing management approaches is appropriate)",
      "note": "Depends on severity, clinical evaluation and the treating specialist's assessment.",
      "optionsToDiscuss": ["Non-surgical, medical, or procedural option a clinician may discuss"]
    }
  ],

  "procedureCostEstimates": [
    { "procedure": "Procedure name", "approximateRangeINR": "e.g. ₹40,000 - ₹90,000", "note": "Rough estimate only; actual cost depends on city, hospital, insurance and complexity." }
  ],

  "medicalFollowUp": ["Appropriate professional follow-up suggestion"],

  "monitor": ["Something relevant to track over time"],

  "precautions": ["Important precaution"],

  "disclaimer": "This report provides general educational guidance based on the information you provided. It is not a medical diagnosis and does not replace evaluation, diagnosis, or treatment by a qualified healthcare professional."
}

=====================================================
SECTION RULES
=====================================================

- "primaryConcerns": one entry per distinct concern pattern you identify from the symptoms/conditions/free text — not one entry per single symptom word. Group related symptoms into a coherent pattern (e.g. irregular cycles + severe pain + vomiting + sweating = one concern, not four).
- "possibleEvaluationAreas" and "recommendedSpecialists": only meaningful if there are actual concerns to evaluate. If the profile is genuinely low-concern (no conditions, no notable symptoms), these can be short or empty — do not force manufactured concerns.
- "treatmentInformation": include for TWO kinds of conditions — (a) conditions where medical/procedural management is plausibly relevant (e.g. gynecological conditions, orthopedic conditions, gallstones, hernia), and (b) conditions primarily managed through structured lifestyle intervention (e.g. obesity, prediabetes, hypertension) — for these, "optionsToDiscuss" should list things like "structured lifestyle intervention", "dietitian-guided management", "behavioural support", "evaluation for related complications", and "medical treatment where clinically appropriate," NOT invented medication names. Leave as [] only for conditions with no meaningful management discussion (e.g. an isolated reported deficiency with no other complications).
- "procedureCostEstimates": ONLY include entries for actual procedures/investigations with reasonably well-known typical Indian private-hospital ranges (e.g. pelvic ultrasound, blood panels). Leave as [] if nothing fits.
- "conditionSpecificGuidance": only include where diet meaningfully matters (e.g. hypertension, diabetes, anemia, PCOS, calcium/vitamin D deficiency, kidney issues).
- "yoga": include 4-6 poses appropriate after safety filtering, or fewer gentle/breathing-only entries if the profile suggests caution is warranted. Always fill in "duration" and "frequency" for each pose — never leave them blank.
- "physicalActivity": "currentRecommendation" should reflect what's appropriate right now; "beginnerPlan" is concrete first-1-2-weeks steps; "progression" is how to build up after that. Do not skip "progression" just because the plan is simple — even a modest progression (e.g. "increase daily walking by 5 minutes every week until reaching 30 minutes") is more useful than a flat instruction repeated forever.
- If height, weight, waist circumference, dietary preference, or budget were not provided and are relevant to giving a precise calorie/weight target, say so explicitly in "physicalActivity" or "nutrition" guidance (e.g. "A precise calorie target would require your height, weight, and dietary preferences — here is general guidance in the meantime") rather than inventing a specific number.
- Every meal-plan array ("breakfastOptions", "lunchOptions", "dinnerOptions", "snackOptions") must contain at least 3 distinct, affordable, realistic Indian options — not just one. Vary them (e.g. don't repeat "oats" as the only breakfast) and keep them appropriate to the user's stated financial level AND dietary preference (see Safety Rule 9).
- Do not repeat the content of "healthAssessment" anywhere else in the report (not in "primaryConcerns", not anywhere). Each section should add new information, not restate the same paragraph in different words.

Return JSON only. No markdown. No code fences. No text before or after the JSON object.
`;

    // =================================================
    // GEMINI REQUEST
    // =================================================

    const response =
      await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          maxOutputTokens: 12000,
          responseMimeType: "application/json",
        },
      });

    // =================================================
    // READ RESPONSE
    // =================================================

    const responseText =
      response.text ||
      response.response?.text?.() ||
      "";

    if (!responseText.trim()) {
      throw new Error(
        "Empty response received from AI."
      );
    }

    // ---------------------------------------------------
    // DIAGNOSTIC LOGGING
    // If the model got cut off mid-generation (finishReason
    // "MAX_TOKENS") the JSON will usually fail to parse below.
    // If it parses but sections are thin/empty, this log tells
    // you it wasn't a token-limit issue — the model chose not
    // to fill them, which points back to the prompt.
    // ---------------------------------------------------

    const finishReason =
      response.candidates?.[0]?.finishReason ||
      "unknown";

    console.log(
      `Care plan generation — finishReason: ${finishReason}, response length: ${responseText.length} chars`
    );

    if (finishReason === "MAX_TOKENS") {
      console.warn(
        "⚠️  Gemini hit the maxOutputTokens limit — response was likely truncated. Consider raising maxOutputTokens further or trimming the schema."
      );
    }

    // =================================================
    // CLEAN RESPONSE
    // =================================================

    const cleanedText =
      responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    // =================================================
    // PARSE JSON
    // =================================================

    let carePlan;

    try {
      carePlan = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "Care Plan JSON parse error:",
        parseError
      );

      console.error(
        "AI response:",
        cleanedText
      );

      return res.status(500).json({
        success: false,
        error:
          "SafeSurf AI returned an invalid care plan.",
      });
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.json({
      success: true,
      carePlan,

      meta: {
        geminiUsed: true,
      },
    });

  } catch (error) {
    console.error(
      "Care Plan API error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "SafeSurf AI could not generate your care plan.",
    });
  }
});

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
// =====================================================
// BODYSCOPE AI API
// =====================================================

app.post("/api/bodyscope/analyze", async (req, res) => {
  try {
    const {
      bodyPart,
      gender,
      view,
      symptoms,
      painTypes,
      severity,
      description,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !bodyPart ||
      typeof bodyPart !== "string" ||
      !bodyPart.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Please select a body part.",
      });
    }

    // Clean symptoms
    const cleanSymptoms = Array.isArray(symptoms)
      ? symptoms
          .filter(
            (symptom) =>
              typeof symptom === "string" &&
              symptom.trim().length > 0
          )
          .map((symptom) => symptom.trim())
      : [];

    // Clean pain types
    const cleanPainTypes = Array.isArray(painTypes)
      ? painTypes
          .filter(
            (pain) =>
              typeof pain === "string" &&
              pain.trim().length > 0
          )
          .map((pain) => pain.trim())
      : [];

    // Clean severity
    const painSeverity =
      typeof severity === "number" &&
      severity >= 0 &&
      severity <= 10
        ? severity
        : null;

    // Clean description
    const additionalDescription =
      typeof description === "string"
        ? description.trim()
        : "";

    // =================================================
    // CHECK GEMINI
    // =================================================

    if (!ai) {
      return res.status(503).json({
        success: false,
        error:
          "AI service is currently unavailable. Please try again later.",
      });
    }

    // =================================================
    // BUILD USER CONTEXT
    // =================================================

    const userContext = `
Body part selected: ${bodyPart.trim()}

Gender: ${gender || "Not specified"}

Body view: ${view || "Not specified"}

Symptoms:
${
  cleanSymptoms.length > 0
    ? cleanSymptoms.join(", ")
    : "Not specified"
}

Pain type:
${
  cleanPainTypes.length > 0
    ? cleanPainTypes.join(", ")
    : "Not specified"
}

Pain severity:
${
  painSeverity !== null
    ? `${painSeverity}/10`
    : "Not specified"
}

Additional details:
${
  additionalDescription ||
  "No additional details provided."
}
`;

    // =================================================
    // GEMINI PROMPT
    // =================================================

    const prompt = `
You are BodyScope AI, an educational healthcare information assistant.

A user has selected a specific body area and described their symptoms.

IMPORTANT USER CONTEXT:

${userContext}

Your role is to provide general educational health information based on the COMPLETE context above.

IMPORTANT SAFETY RULES:

1. Do NOT diagnose the user.

2. Do NOT state or imply that a specific disease or medical condition is the most likely cause.

3. Do NOT say or imply that the user definitely has a particular condition.

4. In "possible_causes", provide broad and general explanations rather than making a diagnosis.

5. Use cautious language such as:
   - "Some possible explanations include..."
   - "These symptoms can sometimes be associated with..."
   - "There are several possible causes, including..."

6. Do NOT create unnecessary fear or alarm.

7. Do NOT prescribe medications or provide prescription drug dosages.

8. Consider ALL of the following together:
   - selected body part
   - gender
   - symptoms
   - pain type
   - pain severity
   - additional details

9. If the user reports a potentially concerning combination of symptoms, clearly recommend appropriate professional medical evaluation.

Examples of potentially concerning combinations include:
- a new lump with bloody or unusual discharge
- a new or changing lump
- unexplained bleeding
- severe or rapidly worsening pain
- sudden weakness or numbness
- difficulty breathing
- chest pain with pain spreading to the arm, jaw, or back
- loss of consciousness
- severe allergic-type symptoms

10. For concerning symptoms, do NOT use weak language such as:
"Schedule an appointment when convenient."

Instead clearly say something similar to:
"Please arrange prompt medical evaluation rather than waiting to see if the symptoms resolve on their own."

11. Do NOT automatically treat every concerning symptom as an emergency.

Emergency warnings should only be used when the reported symptoms suggest a possible emergency.

12. If symptoms are mild and there are no obvious warning signs, provide safe general monitoring and self-care suggestions where appropriate.

13. If symptoms include a potentially concerning sign, explain that there can still be different causes and that only a qualified healthcare professional can determine the cause through appropriate examination or testing.

Your response MUST be valid JSON only.

Use EXACTLY this structure:

{
  "summary": "Briefly summarize exactly what the user reported without adding symptoms they did not mention.",

  "possible_causes": [
    "A broad, cautious possible explanation",
    "Another broad, cautious possible explanation",
    "Another general explanation if appropriate"
  ],

  "what_to_monitor": [
    "Relevant symptom or change to monitor",
    "Another relevant symptom or change to monitor",
    "Another relevant change if appropriate"
  ],

  "next_steps": [
    "A safe and appropriate next step based on the severity and symptoms",
    "Another appropriate next step"
  ],

  "urgent_warning": "Clearly explain whether prompt medical evaluation or emergency care is appropriate based only on the reported symptoms."
}

SPECIAL INSTRUCTION FOR POSSIBLE CAUSES:

Do not list a specific disease as though it explains the user's symptoms.

For example, instead of saying:

"Your symptoms may be caused by intraductal papilloma."

Prefer broader wording such as:

"Changes within breast tissue or milk ducts can sometimes contribute to a lump or unusual discharge."

Do not include markdown.
Do not include headings.
Do not include \`\`\`json.
Return JSON only.
`;

    // =================================================
    // GEMINI REQUEST
    // =================================================

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    const responseText =
      response.text ||
      response.response?.text?.() ||
      "";

    if (!responseText.trim()) {
      throw new Error(
        "Empty response received from AI."
      );
    }

    // =================================================
    // CLEAN AI RESPONSE
    // =================================================

    const cleanedText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "BodyScope AI JSON parse error:",
        parseError
      );

      return res.status(500).json({
        success: false,
        error:
          "BodyScope AI returned an invalid response.",
      });
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.json({
      success: true,

      analysis,

      meta: {
        bodyPart: bodyPart.trim(),
        gender: gender || "Not specified",
        view: view || "Not specified",
        symptoms: cleanSymptoms,
        painTypes: cleanPainTypes,
        severity: painSeverity,
      },
    });

  } catch (error) {

    console.error(
      "BodyScope AI API error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "BodyScope AI could not complete the analysis.",
    });
  }
});

// =====================================================
// AI HEALTH ASSISTANT CHAT
// =====================================================

app.post("/api/chat", async (req, res) => {

  try {

    const { message } = req.body;


    if (!message || !message.trim()) {

      return res.status(400).json({
        success: false,
        error: "Please enter a message."
      });

    }


    // =================================================
    // SAFESURF AI KNOWLEDGE PROMPT
    // =================================================

    const prompt = `

You are SafeSurf AI, an AI-powered healthcare information
and support assistant.

Your job is to:

1. Answer general health-related questions.
2. Explain health information in simple language.
3. Help users understand SafeSurf AI features.
4. Recommend the most suitable SafeSurf AI tool when appropriate.
5. Never diagnose diseases or prescribe medication.

====================================================
SAFESURF AI PLATFORM FEATURES
====================================================


1. SYMPTOM ANALYZER

The Symptom Analyzer allows users to select or describe
symptoms.

It provides:

- Symptom pattern analysis
- Possible general explanations
- General recommendations
- Warning signs

It does NOT provide a medical diagnosis.

Recommend Symptom Analyzer when the user wants to
understand symptoms generally.

Examples:

"I have fever and cough."

"I have headache and dizziness."

"Why am I feeling tired?"

Recommended feature:
SYMPTOM_ANALYZER


====================================================


2. BODYSCOPE AI

BodyScope AI allows users to select a specific body part
on an interactive human body.

Users can describe:

- Pain
- Discomfort
- Symptoms
- Pain severity
- Type of pain

Recommend BodyScope AI when the user's concern is focused
on a specific body area.

Examples:

"My lower back hurts."

"I have pain in my shoulder."

"My right leg hurts."

"I feel pain near my stomach."

Recommended feature:
BODYSCOPE_AI


====================================================


3. PERSONALIZED CARE PLANNER

The Personalized Care Planner collects information across
four steps.

STEP 1:
Personal and Lifestyle Profile

Includes:

- Age
- Gender
- Height
- Weight
- Budget preferences
- Occupation
- Daily work type
- Physical workload


STEP 2:
Health Information

Includes:

- Known medical conditions
- Symptoms
- Medications
- Allergies
- Previous surgeries
- Medical history


STEP 3:
Medical Reports

Users can optionally upload:

- PDF
- JPG
- PNG

Medical reports can be analyzed and summarized.


STEP 4:
Care Plan

The platform generates personalized general healthcare
and lifestyle guidance using the information provided.

This is educational guidance and does NOT replace a
healthcare professional.

Recommend Personalized Care Planner when the user wants
general personalized guidance based on multiple factors.

Examples:

"I want a complete health plan."

"I want advice based on my lifestyle and health."

"I want personalized healthcare guidance."

Recommended feature:
CARE_PLANNER


====================================================


4. REPORT ANALYZER

The Report Analyzer allows users to upload medical reports.

Supported formats include:

- PDF
- JPG
- PNG

The system helps summarize and explain medical information
in simpler language.

It does NOT provide a definitive diagnosis.

Recommend Report Analyzer when users ask:

"What does my report mean?"

"Can you explain my blood test?"

"I want to understand my medical report."

Recommended feature:
REPORT_ANALYZER


====================================================


5. HEALTH ARTICLES

The Health Articles section allows users to explore
easy-to-understand information about health conditions.

Users can:

- Search diseases or conditions
- Browse different categories
- Read article previews
- Learn important health information
- Open trusted original sources for detailed information

Categories may include:

- Common Conditions
- Chronic Conditions
- Infectious Diseases
- Mental Health
- Serious Conditions
- Rare Diseases

Article previews may include:

- What is the condition?
- Common symptoms
- Causes or risk factors
- Important warning signs
- General management
- Outlook
- When to seek professional help

Recommend Health Articles when a user wants to learn
about a disease or health condition.

Examples:

"What is diabetes?"

"Tell me about dengue."

"What is Huntington's disease?"

"Explain a rare disease."

Recommended feature:
HEALTH_ARTICLES


====================================================


6. PHARMACY

The Pharmacy section allows users to explore general
healthcare and self-care products.

Categories may include:

- Skincare
- Cold and Allergy
- Digestive Health
- First Aid
- Health Devices

The Pharmacy focuses on general healthcare and self-care
products.

Do NOT claim that a product will cure or treat a disease.

Do NOT prescribe prescription medication.

Recommend Pharmacy when a user wants to explore general
health or self-care products.

Examples:

"What can I use for dry skin?"

"What general products help with cold symptoms?"

"I need basic first aid products."

Recommended feature:
PHARMACY


====================================================


7. AI HEALTH ASSISTANT

You are the AI Health Assistant.

You should answer general healthcare questions while also
helping users navigate the SafeSurf AI platform.

Do not recommend a SafeSurf feature unnecessarily.

If the user asks a simple health question that can be
answered directly, answer the question first.

If another SafeSurf AI feature would genuinely help,
recommend it.


====================================================
SAFETY RULES
====================================================

- Provide educational information only.
- Never diagnose a disease.
- Never claim certainty about a medical condition.
- Never prescribe medicines.
- Never recommend prescription medicines.
- Use cautious wording.

Prefer:

"Some possible explanations can include..."

"Symptoms like these can sometimes be associated with..."

"A healthcare professional can help determine the cause."


Do NOT say:

"You definitely have..."

"You are diagnosed with..."

"This medicine will cure you."


For potentially serious symptoms such as:

- Severe chest pain
- Severe difficulty breathing
- Loss of consciousness
- Signs of stroke
- Severe bleeding
- Severe allergic reaction
- Sudden severe weakness or numbness

Clearly recommend urgent medical attention.


====================================================
RESPONSE FORMAT
====================================================

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "reply": "Your helpful response to the user.",
  "recommendedFeature": "NONE"
}


recommendedFeature MUST be one of:

NONE
SYMPTOM_ANALYZER
BODYSCOPE_AI
CARE_PLANNER
REPORT_ANALYZER
HEALTH_ARTICLES
PHARMACY


Do not include markdown.
Do not include code blocks.
Do not include explanations outside JSON.


====================================================
USER MESSAGE
====================================================

${message}

`;


    // =================================================
    // GEMINI REQUEST
    // =================================================

    const response =
      await ai.models.generateContent({

        model: "gemini-3.1-flash-lite",

        contents: prompt

      });


    const responseText =
      response.text
        ?.replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();


    if (!responseText) {

      throw new Error(
        "AI returned an empty response."
      );

    }


    // =================================================
    // PARSE AI RESPONSE
    // =================================================

    let aiResponse;


    try {

      aiResponse =
        JSON.parse(responseText);

    }

    catch (parseError) {

      console.error(
        "Chat JSON parse error:",
        parseError
      );


      aiResponse = {

        reply: responseText,

        recommendedFeature: "NONE"

      };

    }


    // =================================================
    // RESPONSE TO FRONTEND
    // =================================================

    return res.json({

      success: true,

      reply:
        aiResponse.reply,

      recommendedFeature:
        aiResponse.recommendedFeature ||
        "NONE"

    });


  }

  catch (error) {

    console.error(
      "CHAT ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      error:
        "SafeSurf AI could not generate a response."

    });

  }

});

// =====================================================
// START SERVER
// =====================================================
// =====================================================
// AUTHENTICATION - OTP LOGIN / SIGNUP
// =====================================================

const users = new Map();
const otpStore = new Map();
const sessions = new Map();

const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

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
    if (users.has(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const otp = generateOTP();

    otpStore.set(normalizedEmail, {
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

    const record = otpStore.get(normalizedEmail);

    if (!record || record.type !== "signup") {
      return res.status(404).json({
        success: false,
        message: "No signup verification request found.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);

      return res.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.otp !== String(otp)) {
      record.attempts += 1;

      if (record.attempts >= 5) {
        otpStore.delete(normalizedEmail);

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
    users.set(normalizedEmail, {
      username: username || record.username,
      email: normalizedEmail,
      mobile: mobile || record.mobile,
      verified: true,
      createdAt: new Date().toISOString(),
    });

    otpStore.delete(normalizedEmail);

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

    const user = users.get(normalizedEmail);

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

    otpStore.set(normalizedEmail, {
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

    const record = otpStore.get(normalizedEmail);

    if (!record || record.type !== "login") {
      return res.status(404).json({
        success: false,
        message: "No login OTP request found.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);

      return res.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.otp !== String(otp)) {
      record.attempts += 1;

      if (record.attempts >= 5) {
        otpStore.delete(normalizedEmail);

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

    const user = users.get(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Generate login token
    const token = crypto.randomBytes(32).toString("hex");

    sessions.set(token, {
      email: normalizedEmail,
      createdAt: Date.now(),
    });

    otpStore.delete(normalizedEmail);

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

app.listen(PORT, () => {
  console.log(
    `SafeSurf AI backend running at http://localhost:${PORT}`
  );
});