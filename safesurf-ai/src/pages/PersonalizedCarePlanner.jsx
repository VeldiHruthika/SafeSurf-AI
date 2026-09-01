import { useRef, useState } from "react";
import "../styles/PersonalizedCarePlanner.css";

// =====================================================
// BMI HELPER
// Mirrors the backend calculation so Step 4 can show a
// quick Health Metrics card without waiting on the AI.
// =====================================================

function calculateBMI(heightCm, weightKg) {

  const heightNum = parseFloat(heightCm);
  const weightNum = parseFloat(weightKg);

  if (
    !heightNum ||
    !weightNum ||
    heightNum <= 0 ||
    weightNum <= 0
  ) {
    return null;
  }

  const heightMeters = heightNum / 100;

  const value =
    Math.round(
      (weightNum / (heightMeters * heightMeters)) * 10
    ) / 10;

  let category = "Obesity range";
  let badgeClass = "care-plan-priority-high";

  if (value < 18.5) {
    category = "Underweight";
    badgeClass = "care-plan-priority-moderate";
  } else if (value < 25) {
    category = "Normal range";
    badgeClass = "care-plan-priority-low";
  } else if (value < 30) {
    category = "Overweight range";
    badgeClass = "care-plan-priority-moderate";
  }

  return { value, category, badgeClass };

}


function PersonalizedCarePlanner({ goHome }) {

  // =====================================================
  // CURRENT STEP
  // =====================================================

  const [currentStep, setCurrentStep] = useState(1);
 // =====================================================
// REPORT ANALYZER STATE
// =====================================================

const fileInputRef = useRef(null);

const [selectedFiles, setSelectedFiles] = useState([]);

const [reportAnalysis, setReportAnalysis] =
  useState(null);

const [reportError, setReportError] =
  useState("");

const [isAnalyzingReport, setIsAnalyzingReport] =
  useState(false);
  // =====================================================
// CARE PLAN STATE
// =====================================================

const [carePlan, setCarePlan] =
  useState(null);

const [carePlanError, setCarePlanError] =
  useState("");

const [isGeneratingCarePlan, setIsGeneratingCarePlan] =
  useState(false);


  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({

    // STEP 1

    age: "",
    gender: "",
    height: "",
    weight: "",

    financialLevel: "",

    dietaryPreference: "",

    occupation: "",
    workType: "",
    workload: "",


    // STEP 2

    knownConditions: [],

    customCondition: "",

    symptoms: "",

    medications: "",

    allergies: "",

    previousSurgeries: "",

    medicalHistory: "",

// STEP 3

reportAnalysis: null

  });


  // =====================================================
  // AVAILABLE CONDITIONS
  // =====================================================

  const medicalConditions = [

    "Diabetes",

    "Hypertension",

    "Anemia",

    "PCOS",

    "Hypothyroidism",

    "Hyperthyroidism",

    "Sciatica",

    "Osteoarthritis",

    "Osteoporosis",

    "Calcium Deficiency",

    "Vitamin D Deficiency",

    "Vitamin B12 Deficiency",

    "Asthma",

    "Heart Disease",

    "Kidney Disease",

    "Liver Disease",

    "High Cholesterol",

    "Obesity",

    "Arthritis",

    "Migraine",

    "Anxiety / Depression",

    "Other"

  ];


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  // =====================================================
  // HANDLE CONDITION SELECTION
  // =====================================================

  const toggleCondition = (condition) => {

    setFormData((prev) => {

      const alreadySelected =
        prev.knownConditions.includes(condition);

      if (alreadySelected) {

        return {

          ...prev,

          knownConditions:
            prev.knownConditions.filter(
              (item) => item !== condition
            )

        };

      }


      return {

        ...prev,

        knownConditions: [

          ...prev.knownConditions,

          condition

        ]

      };

    });

  };


  // =====================================================
  // ADD CUSTOM CONDITION
  // =====================================================

  const addCustomCondition = () => {

    const newCondition =
      formData.customCondition.trim();


    if (!newCondition) {

      return;

    }


    const alreadyExists =
      formData.knownConditions.some(
        (condition) =>
          condition.toLowerCase() ===
          newCondition.toLowerCase()
      );


    if (alreadyExists) {

      setFormData((prev) => ({
        ...prev,
        customCondition: ""
      }));

      return;

    }


    setFormData((prev) => ({

      ...prev,

      knownConditions: [

        ...prev.knownConditions,

        newCondition

      ],

      customCondition: ""

    }));

  };


  // =====================================================
  // REMOVE CONDITION
  // =====================================================

  const removeCondition = (conditionToRemove) => {

    setFormData((prev) => ({

      ...prev,

      knownConditions:
        prev.knownConditions.filter(
          (condition) =>
            condition !== conditionToRemove
        )

    }));

  };


  // =====================================================
  // STEP 1 CONTINUE
  // =====================================================

  const handleStepOneContinue = () => {

    if (
      !formData.age ||
      !formData.gender ||
      !formData.financialLevel ||
      !formData.workType ||
      !formData.workload
    ) {

      alert(
        "Please complete all required fields before continuing."
      );

      return;

    }


    setCurrentStep(2);

  };


  // =====================================================
  // STEP 2 CONTINUE
  // =====================================================

  const handleStepTwoContinue = () => {

  setCurrentStep(3);

};
// =====================================================
// STEP 3 - REPORT FILE SELECTION
// =====================================================

const handleReportFileChange = (event) => {

  const files = Array.from(event.target.files || []);

  if (files.length === 0) {
    return;
  }

  setReportError("");

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10 MB

  const validFiles = files.filter((file) => {

    if (!allowedTypes.includes(file.type)) {
      setReportError(
        `${file.name} is not a supported file type. Please upload PDF, JPG, JPEG, or PNG files.`
      );

      return false;
    }

    if (file.size > maxFileSize) {
      setReportError(
        `${file.name} is larger than 10 MB. Please choose a smaller file.`
      );

      return false;
    }

    return true;

  });

  setSelectedFiles((previousFiles) => {

    const existingNames = new Set(
      previousFiles.map((file) => file.name)
    );

    const newFiles = validFiles.filter(
      (file) => !existingNames.has(file.name)
    );

    return [
      ...previousFiles,
      ...newFiles
    ];

  });

  // Allow selecting the same file again later
  event.target.value = "";

};


// =====================================================
// OPEN FILE PICKER
// =====================================================

const openReportFilePicker = () => {

  fileInputRef.current?.click();

};
// =====================================================
// REMOVE REPORT
// =====================================================

// =====================================================
// REMOVE REPORT
// =====================================================

const removeReportFile = (index) => {

  setSelectedFiles((previousFiles) =>
    previousFiles.filter(
      (_, fileIndex) => fileIndex !== index
    )
  );

  setReportAnalysis(null);
  setReportError("");

  setFormData((prev) => ({
    ...prev,
    reportAnalysis: null
  }));

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

};

// =====================================================
// ANALYZE ALL REPORTS
// =====================================================

const analyzePlannerReport = async () => {

  if (selectedFiles.length === 0) {
    return;
  }

  setReportError("");
  setReportAnalysis(null);
  setIsAnalyzingReport(true);

  try {

    const reportFormData = new FormData();

    // ADD ALL SELECTED REPORTS
    selectedFiles.forEach((file) => {
      reportFormData.append("reports", file);
    });

    const response = await fetch(
  "http://localhost:5000/api/report-analyze",
  {
    method: "POST",
    body: reportFormData,
  }
);
// =============================================
    // READ SERVER RESPONSE
    // =============================================


const responseText = await response.text();

console.log(
  "Report API raw response:",
  response.status,
  responseText
);

let data;

try {

  data = JSON.parse(responseText);

} catch (parseError) {

  throw new Error(
    `Server returned an invalid response (${response.status}).`
  );

}

console.log(
  "Planner reports analysis:",
  data
);
 // =============================================
    // CHECK RESPONSE
    // =============================================


    if (
      !response.ok ||
      !data.success
    ) {

      throw new Error(
        data.error ||
        "Failed to analyze the reports."
      );

    }

    if (!data.analysis) {

      throw new Error(
        "No analysis was returned by the server."
      );

    }

    setReportAnalysis(
      data.analysis
    );
    
    // =============================================
    // SAVE ANALYSIS
    // =============================================

    setReportAnalysis(
      data.analysis
    );

    setFormData((prev) => ({
      ...prev,
      reportAnalysis: data.analysis
    }));

  }

  catch (error) {

    console.error(
      "Planner reports analysis error:",
      error
    );

    setReportError(
      error.message ||
      "Failed to analyze the reports."
    );

  }

  finally {

    setIsAnalyzingReport(false);

  }

};

// =====================================================
// STEP 3 CONTINUE
// =====================================================

const handleStepThreeContinue = () => {

  console.log(
    "Complete Care Planner Data:",
    formData
  );

  setCurrentStep(4);

};
// =====================================================
// GENERATE PERSONALIZED CARE PLAN
// =====================================================

const generateCarePlan = async () => {

  setCarePlanError("");
  setCarePlan(null);

  setIsGeneratingCarePlan(true);

  try {

    const response = await fetch(
      "http://localhost:5000/api/generate-care-plan",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(formData)
      }
    );


    const data = await response.json();


    console.log(
      "Generated Care Plan:",
      data
    );


    if (
      !response.ok ||
      !data.success
    ) {

      throw new Error(
        data.error ||
        "Failed to generate your care plan."
      );

    }


    if (!data.carePlan) {

      throw new Error(
        "No care plan was returned by the server."
      );

    }


    setCarePlan(
      data.carePlan
    );

  }

  catch (error) {

    console.error(
      "Care plan generation error:",
      error
    );


    setCarePlanError(
      error.message ||
      "Failed to generate your care plan."
    );

  }

  finally {

    setIsGeneratingCarePlan(false);

  }

};




  // =====================================================
  // STEP 1
  // =====================================================

  const renderStepOne = () => {

    return (

      <>

        {/* =============================================
            FORM HEADER
        ============================================= */}

        <div className="form-heading">

          <div className="form-heading-icon">
            ♡
          </div>

          <div>

            <span>
              STEP 1 OF 4
            </span>

            <h2>
              Personal & Lifestyle Profile
            </h2>

            <p>
              Your age, lifestyle and daily activities can
              help provide more relevant and personalized
              health guidance.
            </p>

          </div>

        </div>


        {/* =============================================
            BASIC INFORMATION
        ============================================= */}

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              01
            </span>

            <div>

              <h3>
                Basic Information
              </h3>

              <p>
                Tell us a few basic details.
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* AGE */}

            <div className="form-group">

              <label>
                Age
                <span>*</span>
              </label>

              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
              />

            </div>


            {/* GENDER */}

            <div className="form-group">

              <label>
                Gender
                <span>*</span>
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >

                <option value="">
                  Select gender
                </option>

                <option value="female">
                  Female
                </option>

                <option value="male">
                  Male
                </option>

                <option value="intersex">
                  Intersex
                </option>

                <option value="prefer-not-to-say">
                  Prefer not to say
                </option>

              </select>

            </div>


            {/* HEIGHT */}

            <div className="form-group">

              <label>
                Height
                <small>
                  Optional
                </small>
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  name="height"
                  placeholder="Example: 160"
                  value={formData.height}
                  onChange={handleChange}
                />

                <span>
                  cm
                </span>

              </div>

            </div>


            {/* WEIGHT */}

            <div className="form-group">

              <label>
                Weight
                <small>
                  Optional
                </small>
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  name="weight"
                  placeholder="Example: 60"
                  value={formData.weight}
                  onChange={handleChange}
                />

                <span>
                  kg
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* =============================================
            FINANCIAL LEVEL
        ============================================= */}

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              02
            </span>

            <div>

              <h3>
                Healthcare & Budget Preferences
              </h3>

              <p>
                This helps us suggest practical and affordable
                food and healthcare options. It does not affect
                the quality of health guidance you receive.
              </p>

            </div>

          </div>


          <div className="financial-options">


            <label className="selection-card">

              <input
                type="radio"
                name="financialLevel"
                value="severe-constraints"
                checked={
                  formData.financialLevel ===
                  "severe-constraints"
                }
                onChange={handleChange}
              />

              <div>

                <strong>
                  Severe Financial Constraints
                </strong>

                <span>
                  Prioritize the lowest-cost options
                </span>

              </div>

            </label>


            <label className="selection-card">

              <input
                type="radio"
                name="financialLevel"
                value="low-income"
                checked={
                  formData.financialLevel ===
                  "low-income"
                }
                onChange={handleChange}
              />

              <div>

                <strong>
                  Low Budget
                </strong>

                <span>
                  Focus on affordable everyday options
                </span>

              </div>

            </label>


            <label className="selection-card">

              <input
                type="radio"
                name="financialLevel"
                value="moderate-budget"
                checked={
                  formData.financialLevel ===
                  "moderate-budget"
                }
                onChange={handleChange}
              />

              <div>

                <strong>
                  Moderate Budget
                </strong>

                <span>
                  Balance affordability and variety
                </span>

              </div>

            </label>


            <label className="selection-card">

              <input
                type="radio"
                name="financialLevel"
                value="flexible-budget"
                checked={
                  formData.financialLevel ===
                  "flexible-budget"
                }
                onChange={handleChange}
              />

              <div>

                <strong>
                  Flexible Budget
                </strong>

                <span>
                  No major affordability limitations
                </span>

              </div>

            </label>

          </div>

        </div>


        {/* =============================================
            DIETARY PREFERENCE
        ============================================= */}

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              03
            </span>

            <div>

              <h3>
                Dietary Preference
              </h3>

              <p>
                This helps us suggest realistic meal and
                nutrition options that actually fit what
                you eat.
              </p>

            </div>

          </div>


          <div className="financial-options">


            <label className="selection-card">

              <input
                type="radio"
                name="dietaryPreference"
                value="vegetarian"
                checked={
                  formData.dietaryPreference ===
                  "vegetarian"
                }
                onChange={handleChange}
              />

              <div>

                <strong>
                  Vegetarian
                </strong>

                <span>
                  No meat, fish, or eggs
                </span>

              </div>

            </label>


            <label className="selection-card">

              <input
                type="radio"
                name="dietaryPreference"
                value="eggetarian"
                checked={
                  formData.dietaryPreference ===
                  "eggetarian"
                }
                onChange={handleChange}
              />

              <div>

                <strong>
                  Eggetarian
                </strong>

                <span>
                  Vegetarian, but eats eggs
                </span>

              </div>

            </label>


            <label className="selection-card">

              <input
                type="radio"
                name="dietaryPreference"
                value="non-vegetarian"
                checked={
                  formData.dietaryPreference ===
                  "non-vegetarian"
                }
                onChange={handleChange}
              />

              <div>

                <strong>
                  Non-Vegetarian
                </strong>

                <span>
                  Eats meat, fish, and/or eggs
                </span>

              </div>

            </label>


            <label className="selection-card">

              <input
                type="radio"
                name="dietaryPreference"
                value="vegan"
                checked={
                  formData.dietaryPreference ===
                  "vegan"
                }
                onChange={handleChange}
              />

              <div>

                <strong>
                  Vegan
                </strong>

                <span>
                  No animal products at all
                </span>

              </div>

            </label>

          </div>

        </div>


        {/* =============================================
            WORK & LIFESTYLE
        ============================================= */}

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              04
            </span>

            <div>

              <h3>
                Daily Work & Lifestyle
              </h3>

              <p>
                Daily work can involve significant physical
                activity, including household and caregiving
                responsibilities.
              </p>

            </div>

          </div>


          <div className="form-grid">


            <div className="form-group full-width">

              <label>
                Occupation / Primary Daily Role
              </label>

              <input
                type="text"
                name="occupation"
                placeholder="Example: Student, Teacher, Homemaker, Driver..."
                value={formData.occupation}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                Type of Daily Work
                <span>*</span>
              </label>

              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
              >

                <option value="">
                  Select work type
                </option>

                <option value="student">
                  Student
                </option>

                <option value="desk-work">
                  Office / Desk Work
                </option>

                <option value="household">
                  Household / Domestic Work
                </option>

                <option value="physical-labor">
                  Physical Labor
                </option>

                <option value="healthcare">
                  Healthcare / Caregiving
                </option>

                <option value="teaching">
                  Teaching
                </option>

                <option value="driving">
                  Driving / Transport
                </option>

                <option value="mixed">
                  Mixed Activities
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Physical Workload
                <span>*</span>
              </label>

              <select
                name="workload"
                value={formData.workload}
                onChange={handleChange}
              >

                <option value="">
                  Select activity level
                </option>

                <option value="sedentary">
                  Mostly Sedentary
                </option>

                <option value="light">
                  Light Activity
                </option>

                <option value="moderate">
                  Moderate Activity
                </option>

                <option value="heavy">
                  Heavy Physical Activity
                </option>

                <option value="mixed">
                  Mixed Activity
                </option>

              </select>

            </div>

          </div>

        </div>


        <div className="privacy-note">

          <span>
            🔒
          </span>

          <p>
            Only provide information relevant to your health
            assessment. This tool provides general healthcare
            guidance and does not replace professional medical
            advice or diagnosis.
          </p>

        </div>


        <div className="form-actions">

          <button
            className="secondary-action-btn"
            onClick={goHome}
          >
            Cancel
          </button>


          <button
            className="primary-action-btn"
            onClick={handleStepOneContinue}
          >
            Continue to Health Information

            <span>
              →
            </span>

          </button>

        </div>

      </>

    );

  };


  // =====================================================
  // STEP 2
  // =====================================================

  const renderStepTwo = () => {

    return (

      <>

        {/* =============================================
            FORM HEADER
        ============================================= */}

        <div className="form-heading">

          <div className="form-heading-icon">
            🩺
          </div>

          <div>

            <span>
              STEP 2 OF 4
            </span>

            <h2>
              Health Information
            </h2>

            <p>
              Tell us about known health conditions, current
              concerns and relevant medical history. You can
              select from the options below or add your own.
            </p>

          </div>

        </div>


        {/* =============================================
            KNOWN CONDITIONS
        ============================================= */}

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              01
            </span>

            <div>

              <h3>
                Known Medical Conditions
              </h3>

              <p>
                Select any conditions that have been diagnosed
                or previously identified by a healthcare
                professional.
              </p>

            </div>

          </div>


          <div className="condition-grid">

            {medicalConditions.map((condition) => (

              <button
                type="button"
                key={condition}
                className={`condition-chip ${
                  formData.knownConditions.includes(condition)
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  toggleCondition(condition)
                }
              >

                <span>
                  {condition}
                </span>

                {formData.knownConditions.includes(condition)
                  ? "✓"
                  : "+"}

              </button>

            ))}

          </div>


          {/* CUSTOM CONDITION */}

          <div className="custom-condition">

            <label>
              Can't find the condition?
            </label>

            <div className="custom-condition-input">

              <input
                type="text"
                name="customCondition"
                placeholder="Example: Enlarged ovary, lupus, disc herniation..."
                value={formData.customCondition}
                onChange={handleChange}
                onKeyDown={(e) => {

                  if (e.key === "Enter") {

                    e.preventDefault();

                    addCustomCondition();

                  }

                }}
              />

              <button
                type="button"
                onClick={addCustomCondition}
              >
                Add Condition
              </button>

            </div>

          </div>


          {/* SELECTED CONDITIONS */}

          {formData.knownConditions.length > 0 && (

            <div className="selected-conditions">

              <span className="selected-label">
                Selected Conditions
              </span>


              <div className="selected-condition-list">

                {formData.knownConditions.map(
                  (condition) => (

                    <button
                      type="button"
                      key={condition}
                      className="selected-condition"
                      onClick={() =>
                        removeCondition(condition)
                      }
                      title="Remove condition"
                    >

                      {condition}

                      <span>
                        ×
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          )}

        </div>


        {/* =============================================
            SYMPTOMS & CONCERNS
        ============================================= */}

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              02
            </span>

            <div>

              <h3>
                Current Symptoms & Health Concerns
              </h3>

              <p>
                Describe what you are currently experiencing
                in your own words.
              </p>

            </div>

          </div>


          <div className="form-group">

            <label>
              Describe your symptoms or concerns
            </label>

            <textarea
              name="symptoms"
              placeholder="Example: I have lower back pain that travels down my right leg. It becomes worse after standing for long periods..."
              value={formData.symptoms}
              onChange={handleChange}
              rows="6"
            />

          </div>

        </div>


        {/* =============================================
            MEDICATIONS & ALLERGIES
        ============================================= */}

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              03
            </span>

            <div>

              <h3>
                Medications & Allergies
              </h3>

              <p>
                Include only information that is relevant to
                your current healthcare needs.
              </p>

            </div>

          </div>


          <div className="form-grid">


            <div className="form-group">

              <label>
                Current Medications
                <small>
                  Optional
                </small>
              </label>

              <textarea
                name="medications"
                placeholder="Example: List current medicines, supplements or treatments..."
                value={formData.medications}
                onChange={handleChange}
                rows="5"
              />

            </div>


            <div className="form-group">

              <label>
                Known Allergies
                <small>
                  Optional
                </small>
              </label>

              <textarea
                name="allergies"
                placeholder="Example: Medicine, food or other known allergies..."
                value={formData.allergies}
                onChange={handleChange}
                rows="5"
              />

            </div>

          </div>

        </div>


        {/* =============================================
            MEDICAL HISTORY
        ============================================= */}

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              04
            </span>

            <div>

              <h3>
                Previous Medical History
              </h3>

              <p>
                Add any previous surgeries, hospitalizations or
                important health history that may be relevant.
              </p>

            </div>

          </div>


          <div className="form-grid">


            <div className="form-group">

              <label>
                Previous Surgeries / Procedures
                <small>
                  Optional
                </small>
              </label>

              <textarea
                name="previousSurgeries"
                placeholder="Example: Appendectomy in 2019..."
                value={formData.previousSurgeries}
                onChange={handleChange}
                rows="5"
              />

            </div>


            <div className="form-group">

              <label>
                Other Relevant Medical History
                <small>
                  Optional
                </small>
              </label>

              <textarea
                name="medicalHistory"
                placeholder="Example: Previous hospitalization, recurring health concerns..."
                value={formData.medicalHistory}
                onChange={handleChange}
                rows="5"
              />

            </div>

          </div>

        </div>


        {/* =============================================
            NOTE
        ============================================= */}

        <div className="privacy-note">

          <span>
            🩺
          </span>

          <p>
            Please enter known or professionally diagnosed
            conditions where possible. SafeSurf AI can help
            organize and explain health information, but it
            does not provide a definitive medical diagnosis.
          </p>

        </div>


        {/* =============================================
            ACTIONS
        ============================================= */}

        <div className="form-actions">

          <button
            className="secondary-action-btn"
            onClick={() =>
              setCurrentStep(1)
            }
          >
            ← Back
          </button>


          <button
            className="primary-action-btn"
            onClick={handleStepTwoContinue}
          >
            Continue to Medical Reports

            <span>
              →
            </span>

          </button>

        </div>

      </>

    );

  };
   // =====================================================
// STEP 3 - MEDICAL REPORTS
// =====================================================

const renderStepThree = () => {

  return (

    <>

      {/* =============================================
          FORM HEADER
      ============================================= */}

      <div className="form-heading">

        <div className="form-heading-icon">
          📄
        </div>

        <div>

          <span>
            STEP 3 OF 4
          </span>

          <h2>
            Medical Reports
          </h2>

          <p>
            Upload one or more medical reports if you
            have them. This step is optional, but reports
            can help provide more personalized guidance.
          </p>

        </div>

      </div>


      {/* =============================================
          UPLOAD SECTION
      ============================================= */}

      {!reportAnalysis && (

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              01
            </span>

            <div>

              <h3>
                Upload Medical Reports
              </h3>

              <p>
                You can upload multiple blood tests,
                laboratory reports, prescriptions, scans,
                or other supported healthcare documents.
              </p>

            </div>

          </div>
<div
            className={
              selectedFiles.length > 0
                ? "report-upload-box has-file"
                : "report-upload-box"
            }
          >

            <div className="upload-icon">
              ↑
            </div>
             <h3>

              {selectedFiles.length > 0
                ? `${selectedFiles.length} Report${
                    selectedFiles.length > 1 ? "s" : ""
                  } Selected`
                : "Upload your reports"}

            </h3>

            <p>

              {selectedFiles.length > 0
                ? "Your reports are ready for AI analysis."
                : "Choose one or more PDF, JPG, or PNG files from your device."}

            </p>


            {/* =========================================
                FILE INPUT
            ========================================= */}
              <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleReportFileChange}
              className="report-file-input"
            />
 {/* =========================================
                CHOOSE REPORTS BUTTON
            ========================================= */}

            <button
              type="button"
              className="report-upload-btn"
              onClick={openReportFilePicker}
            >

              {selectedFiles.length > 0
                ? "＋ Add More Reports"
                : "Choose Reports"}

            </button>


            {/* =========================================
                SELECTED FILES
            ========================================= */}
{selectedFiles.length > 0 && (

              <div className="selected-files-list">

                {selectedFiles.map(
                  (file, index) => (

                    <div
                      className="selected-file"
                      key={`${file.name}-${index}`}
                    >

                      <div className="selected-file-icon">
                        📄
                      </div>


                      <div className="selected-file-info">

                        <strong>
                          {file.name}
                        </strong>

                        <span>
                          {(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </span></div>


                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() =>
                          removeReportFile(index)
                        }
                        aria-label={`Remove ${file.name}`}
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

            )}  {/* =========================================
                FILE TYPE INFO
            ========================================= */}

            <span className="report-file-types">
              Supported formats: PDF, JPG, JPEG, PNG
              • Maximum 10 MB per file
            </span>

          </div>

        </div>

      )}


      {/* =============================================
          ERROR
      ============================================= */}

      {reportError && (

          <div className="report-error">

            ⚠ {reportError}

          </div>

        )}


         {/* =============================================
          ANALYZE BUTTON
      ============================================= */}

      {selectedFiles.length > 0 &&
        !reportAnalysis && (

        <button
          type="button"
          className="report-analyze-btn"
          disabled={isAnalyzingReport}
          onClick={analyzePlannerReport}
        >

          {isAnalyzingReport
            ? "✦ Analyzing Reports..."
            : `✦ Analyze ${
                selectedFiles.length
              } Report${
                selectedFiles.length > 1
                  ? "s"
                  : ""
              }`}

        </button>

      )}

        {/* =============================================
          REPORT ANALYSIS
      ============================================= */}

      {reportAnalysis && (

        <div className="planner-report-results">


          <div className="report-results-header">

            <span className="report-results-badge">
              ✦ AI ANALYSIS COMPLETE
            </span>

            <h2>
              Your Report Analysis
            </h2>

            <p>
              Here is a simplified explanation of the
              information found in your uploaded reports.
            </p>

          </div>
           {/* =========================================
              REPORT COUNT
          ========================================= */}

          {reportAnalysis.reports &&
            Array.isArray(reportAnalysis.reports) && (

            <div className="report-result-section">

              <div className="report-result-section-title">

                <span>
                  📄
                </span>

                <h3>
                  Reports Analyzed
                </h3>

              </div>

              <p className="report-result-text">

                {reportAnalysis.reports.length} medical
                report
                {reportAnalysis.reports.length > 1
                  ? "s were"
                  : " was"}{" "}
                successfully analyzed.

              </p>

            </div>)}


          {/* =========================================
              SUMMARY
          ========================================= */}{reportAnalysis.summary && (

            <div className="report-result-section">

              <div className="report-result-section-title">

                <span>
                  📋
                </span>

                <h3>
                  Summary
                </h3>

              </div>

              <p className="report-result-text">
                {reportAnalysis.summary}
              </p>

            </div>

          )}


          {/* =========================================
              IMPORTANT VALUES
          ========================================= */} {Array.isArray(
            reportAnalysis.important_values
          ) &&
          reportAnalysis.important_values.length > 0 && (

            <div className="report-result-section">

              <div className="report-result-section-title">

                <span>
                  🧪
                </span>

                <h3>
                  Important Values
                </h3>

              </div>


              <div className="report-values-list">

                {reportAnalysis.important_values.map(
                  (item, index) => (

                    <div
                      className="report-value-item"
                      key={`${item.name}-${index}`}
                    >

                       <div className="report-value-name">
                        {item.name}
                      </div>

                      <div className="report-value-result">
                        {item.result}
                      </div>

                      <div className="report-value-status">
                        {item.status}
                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* =========================================
              EASY EXPLANATION
          ========================================= */}

           {reportAnalysis.explanation && (

            <div className="report-result-section">

              <div className="report-result-section-title">

                <span>
                  💡
                </span>

                <h3>
                  Easy Explanation
                </h3>

              </div>

              <p className="report-result-text">
                {reportAnalysis.explanation}
              </p>

            </div>

          )}


          {/* =========================================
              RECOMMENDATIONS
          ========================================= */}


            {Array.isArray(
            reportAnalysis.recommendations
          ) &&
          reportAnalysis.recommendations.length > 0 && (

            <div className="report-result-section">

              <div className="report-result-section-title">

                <span>
                  🩺
                </span>

                <h3>
                  Recommendations
                </h3>

              </div>


              <div className="report-recommendations">

                {reportAnalysis.recommendations.map(
                  (recommendation, index) => (

                    <div
                      className="report-recommendation-item"
                      key={index}
                    >


                        <span>
                          ✓
                        </span>

                        <p>
                          {recommendation}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {/* DISCLAIMER */}

            <div className="report-analysis-disclaimer">

              <span>
                ⚠
              </span>

              <p>
                This report analysis is provided for
                informational purposes only. It does not
                diagnose a medical condition or replace
                advice from a qualified healthcare
                professional.
              </p>

            </div>

          </div>

        )}


        {/* =============================================
            OPTIONAL NOTE
        ============================================= */}

        {!reportAnalysis && (

          <div className="privacy-note">

            <span>
              ℹ️
            </span>

            <p>
              Don't have a medical report? No problem.
              You can skip this step and continue to
              generate your personalized care plan.
            </p>

          </div>

        )}


        {/* =============================================
            ACTIONS
        ============================================= */}

        <div className="form-actions">

          <button
            type="button"
            className="secondary-action-btn"
            onClick={() => setCurrentStep(2)}
          >
            ← Back
          </button>


          <button
            type="button"
            className="primary-action-btn"
            onClick={handleStepThreeContinue}
          >

            {reportAnalysis
              ? "Continue to Your Care Plan"
              : "Skip & Continue"}

            <span>
              →
            </span>

          </button>

        </div>

      </>

    );

  };
  // =====================================================
// STEP 4 - PERSONALIZED CARE PLAN
// =====================================================

const renderStepFour = () => {

  return (

    <>

      {/* =============================================
          FORM HEADER
      ============================================= */}

      <div className="form-heading">

        <div className="form-heading-icon">
          ✨
        </div>

        <div>

          <span>
            STEP 4 OF 4
          </span>

          <h2>
            Your Personalized Care Plan
          </h2>

          <p>
            Based on your personal profile, health
            information, and medical report, here is
            a personalized overview of your healthcare needs.
          </p>

        </div>

      </div>


      {/* =============================================
          PROFILE SUMMARY
      ============================================= */}

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            01
          </span>

          <div>

            <h3>
              Your Health Profile
            </h3>

            <p>
              Information collected from your care assessment.
            </p>

          </div>

        </div>


        <div className="care-plan-profile-grid">


          {/* AGE */}

          <div className="care-plan-profile-item">

            <span>
              Age
            </span>

            <strong>
              {formData.age} years
            </strong>

          </div>


          {/* GENDER */}

          <div className="care-plan-profile-item">

            <span>
              Gender
            </span>

            <strong>
              {formData.gender || "Not provided"}
            </strong>

          </div>


          {/* ACTIVITY */}

          <div className="care-plan-profile-item">

            <span>
              Daily Activity
            </span>

            <strong>
              {formData.workload || "Not provided"}
            </strong>

          </div>


          {/* WORK */}

          <div className="care-plan-profile-item">

            <span>
              Work Type
            </span>

            <strong>
              {formData.workType || "Not provided"}
            </strong>

          </div>


          {/* HEIGHT & WEIGHT */}

          {(formData.height || formData.weight) && (

            <div className="care-plan-profile-item">

              <span>
                Height / Weight
              </span>

              <strong>
                {formData.height
                  ? `${formData.height} cm`
                  : "Not provided"
                }
                {" · "}
                {formData.weight
                  ? `${formData.weight} kg`
                  : "Not provided"
                }
              </strong>

            </div>

          )}


          {/* BMI */}

          {(() => {

            const bmi = calculateBMI(
              formData.height,
              formData.weight
            );

            if (!bmi) {
              return null;
            }

            return (

              <div className="care-plan-profile-item">

                <span>
                  Body Mass Index (BMI)
                </span>

                <strong className="care-plan-bmi-value">

                  {bmi.value}

                  <span
                    className={`care-plan-priority-badge ${bmi.badgeClass}`}
                  >
                    {bmi.category}
                  </span>

                </strong>

              </div>

            );

          })()}


          {/* DIETARY PREFERENCE */}

          {formData.dietaryPreference && (

            <div className="care-plan-profile-item">

              <span>
                Dietary Preference
              </span>

              <strong>

                {formData.dietaryPreference === "vegetarian" && "Vegetarian"}
                {formData.dietaryPreference === "eggetarian" && "Eggetarian"}
                {formData.dietaryPreference === "non-vegetarian" && "Non-Vegetarian"}
                {formData.dietaryPreference === "vegan" && "Vegan"}

              </strong>

            </div>

          )}


          {/* CONDITIONS */}

          <div className="care-plan-profile-item full-profile-item">

            <span>
              Known Conditions
            </span>

            <strong>

              {formData.knownConditions.length > 0
                ? formData.knownConditions.join(", ")
                : "No conditions selected"
              }

            </strong>

          </div>

        </div>

      </div>


      {/* =============================================
          MEDICAL REPORT INSIGHTS
      ============================================= */}

      {formData.reportAnalysis && (

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              02
            </span>

            <div>

              <h3>
                Medical Report Insights
              </h3>

              <p>
                Important information identified from your uploaded report.
              </p>

            </div>

          </div>


          {formData.reportAnalysis.summary && (

            <div className="care-plan-report-summary">

              <h4>
                📋 Report Summary
              </h4>

              <p>
                {formData.reportAnalysis.summary}
              </p>

            </div>

          )}


          {Array.isArray(
            formData.reportAnalysis.important_values
          ) &&
          formData.reportAnalysis.important_values.length > 0 && (

            <div className="care-plan-values">

              {formData.reportAnalysis.important_values.map(
                (item, index) => (

                  <div
                    className="care-plan-value"
                    key={`${item.name}-${index}`}
                  >

                    <span>
                      {item.name}
                    </span>

                    <strong>
                      {item.result}
                    </strong>

                    <small>
                      {item.status}
                    </small>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      )}


      {/* =============================================
          HEALTH CONCERNS
      ============================================= */}

      {(formData.symptoms ||
        formData.medications ||
        formData.allergies) && (

        <div className="form-section">

          <div className="form-section-title">

            <span className="section-number">
              03
            </span>

            <div>

              <h3>
                Health Information Summary
              </h3>

              <p>
                Important information you provided during the assessment.
              </p>

            </div>

          </div>


          {formData.symptoms && (

            <div className="care-plan-info-card">

              <h4>
                💬 Current Symptoms
              </h4>

              <p>
                {formData.symptoms}
              </p>

            </div>

          )}


          {formData.medications && (

            <div className="care-plan-info-card">

              <h4>
                💊 Current Medications
              </h4>

              <p>
                {formData.medications}
              </p>

            </div>

          )}


          {formData.allergies && (

            <div className="care-plan-info-card">

              <h4>
                ⚠ Known Allergies
              </h4>

              <p>
                {formData.allergies}
              </p>

            </div>

          )}

        </div>

      )}




{/* =============================================
    GENERATED CARE PLAN
============================================= */}

{carePlan && (

  <div className="generated-care-plan">


    {/* =========================================
        AI HEALTH ASSESSMENT
    ========================================= */}

    <div className="care-plan-highlight">

      <div className="care-plan-highlight-icon">
        ✦
      </div>

      <div>

        <span className="care-plan-ai-label">
          AI-GENERATED PERSONALIZED REPORT
        </span>

        <h3>
          Your Health Assessment
        </h3>

        <p>
          {carePlan.healthAssessment}
        </p>

      </div>

    </div>


    {/* =========================================
        SEEK EARLIER CARE IF (shown early, high visibility)
    ========================================= */}

    {carePlan.seekEarlierCareIf?.length > 0 && (

      <div className="care-plan-redflag-banner">

        <span>⚠</span>

        <div>

          <h4>Seek medical attention sooner if you notice:</h4>

          <ul>
            {carePlan.seekEarlierCareIf.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        </div>

      </div>

    )}


    {/* =========================================
        PRIMARY CONCERNS
    ========================================= */}

    {carePlan.primaryConcerns?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            01
          </span>

          <div>

            <h3>
              Primary Health Concerns
            </h3>

            <p>
              Patterns identified from what you shared, not a diagnosis.
            </p>

          </div>

        </div>


        <div className="care-plan-condition-list">

          {carePlan.primaryConcerns.map((item, index) => (

            <div className="care-plan-condition-card" key={index}>

              <div className="care-plan-condition-header">
                <h4>{item.concern}</h4>

                {item.severity && (
                  <span
                    className={`care-plan-priority-badge care-plan-priority-${(item.severity || "").toLowerCase()}`}
                  >
                    {item.severity} priority
                  </span>
                )}
              </div>

              <p className="care-plan-condition-explanation">
                {item.details}
              </p>

            </div>

          ))}

        </div>

      </div>

    )}


    {/* =========================================
        POSSIBLE EVALUATION AREAS
    ========================================= */}

    {carePlan.possibleEvaluationAreas?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            02
          </span>

          <div>

            <h3>
              Possible Areas for Medical Evaluation
            </h3>

            <p>
              Not a diagnosis — areas a clinician may choose to look into.
            </p>

          </div>

        </div>


        <div className="care-plan-eval-table">

          {carePlan.possibleEvaluationAreas.map((item, index) => (

            <div className="care-plan-eval-row" key={index}>
              <span className="care-plan-eval-concern">{item.concern}</span>
              <span className="care-plan-eval-focus">{item.evaluationFocus}</span>
            </div>

          ))}

        </div>

      </div>

    )}


    {/* =========================================
        RECOMMENDED SPECIALISTS
    ========================================= */}

    {carePlan.recommendedSpecialists?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            03
          </span>

          <div>

            <h3>
              Recommended Specialist
            </h3>

            <p>
              Who to consider consulting, and why.
            </p>

          </div>

        </div>


        <div className="care-plan-specialist-list">

          {carePlan.recommendedSpecialists.map((item, index) => (

            <div className="care-plan-specialist-card" key={index}>
              <h4>👩‍⚕️ {item.specialist}</h4>
              <p>{item.reason}</p>
            </div>

          ))}

        </div>

      </div>

    )}


    {/* =========================================
        TESTS / INVESTIGATIONS TO DISCUSS
    ========================================= */}

    {carePlan.possibleTestsToDiscuss?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            04
          </span>

          <div>

            <h3>
              Investigations to Discuss With a Doctor
            </h3>

            <p>
              Not a prescription for tests — things a clinician may consider.
            </p>

          </div>

        </div>


        <div className="care-plan-ai-list">

          {carePlan.possibleTestsToDiscuss.map((item, index) => (

            <div className="care-plan-ai-item" key={index}>
              <span>🧪</span>
              <p>{item}</p>
            </div>

          ))}

        </div>

      </div>

    )}


    {/* =========================================
        PRIORITIES
    ========================================= */}

    {carePlan.priorities?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            05
          </span>

          <div>

            <h3>
              Your Health Priorities
            </h3>

            <p>
              Areas to focus on based on your profile.
            </p>

          </div>

        </div>


        <div className="care-plan-ai-list">

          {carePlan.priorities.map(
            (item, index) => (

              <div
                className="care-plan-ai-item"
                key={index}
              >

                <span>
                  {index + 1}
                </span>

                <p>
                  {item}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    )}


    {/* =========================================
        DAILY ROUTINE
    ========================================= */}

    {carePlan.dailyRoutine?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            06
          </span>

          <div>

            <h3>
              Daily Routine
            </h3>

            <p>
              A realistic routine designed around
              your lifestyle.
            </p>

          </div>

        </div>


        <div className="care-plan-routine-grid">

          {carePlan.dailyRoutine.map(
            (routine, index) => (

              <div
                className="care-plan-routine-card"
                key={index}
              >

                <h4>
                  {routine.time}
                </h4>

                <ul>

                  {routine.activities?.map(
                    (activity, activityIndex) => (

                      <li key={activityIndex}>
                        {activity}
                      </li>

                    )
                  )}

                </ul>

              </div>

            )
          )}

        </div>

      </div>

    )}


    {/* =========================================
        NUTRITION
    ========================================= */}

    {carePlan.nutrition && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            07
          </span>

          <div>

            <h3>
              Nutrition & Meal Guidance
            </h3>

            <p>
              Practical, Indian-context nutrition guidance suited to your profile.
            </p>

          </div>

        </div>

        {carePlan.nutrition.guidance?.length > 0 && (

          <div className="care-plan-ai-list care-plan-ai-list-spaced-bottom">

            {carePlan.nutrition.guidance.map((item, index) => (
              <div className="care-plan-ai-item" key={index}>
                <span>✓</span>
                <p>{item}</p>
              </div>
            ))}

          </div>

        )}

        {(carePlan.nutrition.breakfastOptions?.length > 0 ||
          carePlan.nutrition.lunchOptions?.length > 0 ||
          carePlan.nutrition.dinnerOptions?.length > 0 ||
          carePlan.nutrition.snackOptions?.length > 0) && (

          <div className="care-plan-mealplan-grid">

            {[
              ["Breakfast", carePlan.nutrition.breakfastOptions],
              ["Lunch", carePlan.nutrition.lunchOptions],
              ["Snacks", carePlan.nutrition.snackOptions],
              ["Dinner", carePlan.nutrition.dinnerOptions],
            ].map(([label, items]) =>
              items?.length > 0 && (

                <div className="care-plan-routine-card" key={label}>

                  <h4>{label}</h4>

                  <ul>
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                </div>

              )
            )}

          </div>

        )}

        {carePlan.nutrition.foodsToLimit?.length > 0 && (

          <div className="care-plan-food-column care-plan-food-limit care-plan-food-limit-standalone">
            <h5>Foods to limit</h5>
            <ul>
              {carePlan.nutrition.foodsToLimit.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

        )}

        {carePlan.nutrition.conditionSpecificGuidance?.length > 0 && (

          <div className="care-plan-condition-list care-plan-ai-list-spaced">

            {carePlan.nutrition.conditionSpecificGuidance.map((item, index) => (

              <div className="care-plan-condition-card" key={index}>

                <div className="care-plan-condition-header">
                  <h4>{item.condition}</h4>
                </div>

                <div className="care-plan-food-columns">

                  {item.encourage?.length > 0 && (
                    <div className="care-plan-food-column care-plan-food-include">
                      <h5>Encourage</h5>
                      <ul>
                        {item.encourage.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}

                  {item.limit?.length > 0 && (
                    <div className="care-plan-food-column care-plan-food-limit">
                      <h5>Limit</h5>
                      <ul>
                        {item.limit.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    )}


    {/* =========================================
        PHYSICAL ACTIVITY
    ========================================= */}

    {carePlan.physicalActivity && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            08
          </span>

          <div>

            <h3>
              Physical Activity Plan
            </h3>

            <p>
              A starting point and a way to build up from there — not a flat instruction.
            </p>

          </div>

        </div>


        {[
          ["Current recommendation", carePlan.physicalActivity.currentRecommendation, "✓"],
          ["Where to start", carePlan.physicalActivity.beginnerPlan, "①"],
          ["Building up from there", carePlan.physicalActivity.progression, "↗"],
        ].map(([label, items, icon]) =>
          items?.length > 0 && (

            <div className="care-plan-activity-stage" key={label}>

              <h5>{label}</h5>

              <div className="care-plan-ai-list">

                {items.map((item, index) => (

                  <div className="care-plan-ai-item" key={index}>
                    <span>{icon}</span>
                    <p>{item}</p>
                  </div>

                ))}

              </div>

            </div>

          )
        )}

        {carePlan.physicalActivity.precautions?.length > 0 && (

          <div className="care-plan-ai-list care-plan-ai-list-spaced">

            {carePlan.physicalActivity.precautions.map((item, index) => (

              <div className="care-plan-ai-item care-plan-ai-item-caution" key={index}>
                <span>!</span>
                <p>{item}</p>
              </div>

            ))}

          </div>

        )}

      </div>

    )}


    {/* =========================================
        YOGA PLAN
    ========================================= */}

    {carePlan.yoga?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            09
          </span>

          <div>

            <h3>
              Yoga Plan
            </h3>

            <p>
              Poses selected and safety-filtered for your profile.
            </p>

          </div>

        </div>


        <div className="care-plan-yoga-grid">

          {carePlan.yoga.map((pose, index) => (

            <div className="care-plan-yoga-card" key={index}>

              <div className="care-plan-yoga-header">
                <h4>{pose.name}</h4>
              </div>

              {(pose.duration || pose.frequency) && (
                <div className="care-plan-yoga-meta">
                  {pose.duration && (
                    <span className="care-plan-yoga-meta-chip">⏱ {pose.duration}</span>
                  )}
                  {pose.frequency && (
                    <span className="care-plan-yoga-meta-chip">🔁 {pose.frequency}</span>
                  )}
                </div>
              )}

              {pose.purpose && <p className="care-plan-yoga-purpose">{pose.purpose}</p>}

              {pose.precaution && (
                <p className="care-plan-yoga-precaution">
                  <span>⚠</span> {pose.precaution}
                </p>
              )}

            </div>

          ))}

        </div>

      </div>

    )}


    {/* =========================================
        SLEEP & RECOVERY
    ========================================= */}

    {carePlan.sleepAndRecovery?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            10
          </span>

          <div>

            <h3>
              Sleep & Recovery
            </h3>

            <p>
              Suggestions to support rest and recovery.
            </p>

          </div>

        </div>


        <div className="care-plan-ai-list">

          {carePlan.sleepAndRecovery.map(
            (item, index) => (

              <div
                className="care-plan-ai-item"
                key={index}
              >

                <span>
                  ✓
                </span>

                <p>
                  {item}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    )}


    {/* =========================================
        STRESS MANAGEMENT
    ========================================= */}

    {carePlan.stressManagement?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            11
          </span>

          <div>

            <h3>
              Stress & Mental Wellbeing
            </h3>

            <p>
              Small habits that may support
              emotional wellbeing.
            </p>

          </div>

        </div>


        <div className="care-plan-ai-list">

          {carePlan.stressManagement.map(
            (item, index) => (

              <div
                className="care-plan-ai-item"
                key={index}
              >

                <span>
                  ✓
                </span>

                <p>
                  {item}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    )}


    {/* =========================================
        TREATMENT INFORMATION
    ========================================= */}

    {carePlan.treatmentInformation?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            12
          </span>

          <div>

            <h3>
              Treatment & Management Options to Discuss
            </h3>

            <p>
              General options a specialist may consider — not a prescription.
            </p>

          </div>

        </div>


        <div className="care-plan-condition-list">

          {carePlan.treatmentInformation.map((item, index) => (

            <div className="care-plan-condition-card" key={index}>

              <div className="care-plan-condition-header">
                <h4>{item.condition}</h4>
              </div>

              {item.optionsToDiscuss?.length > 0 && (
                <ul className="care-plan-treatment-options-list">
                  {item.optionsToDiscuss.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              )}

              {item.note && (
                <p className="care-plan-treatment-note">{item.note}</p>
              )}

            </div>

          ))}

        </div>

      </div>

    )}


    {/* =========================================
        PROCEDURE COST ESTIMATES
    ========================================= */}

    {carePlan.procedureCostEstimates?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            13
          </span>

          <div>

            <h3>
              Approximate Procedure Cost Ranges
            </h3>

            <p>
              Rough India-wide estimates only — actual pricing varies by city and hospital.
            </p>

          </div>

        </div>


        <div className="care-plan-cost-list">

          {carePlan.procedureCostEstimates.map((item, index) => (

            <div className="care-plan-cost-item" key={index}>

              <div className="care-plan-cost-item-top">
                <strong>{item.procedure}</strong>
                <span>{item.approximateRangeINR}</span>
              </div>

              {item.note && <p>{item.note}</p>}

            </div>

          ))}

        </div>

      </div>

    )}


    {/* =========================================
        MEDICAL FOLLOW-UP
    ========================================= */}

    {carePlan.medicalFollowUp?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            14
          </span>

          <div>

            <h3>
              Medical Follow-Up
            </h3>

            <p>
              Suggested next steps with a healthcare professional.
            </p>

          </div>

        </div>


        <div className="care-plan-ai-list">

          {carePlan.medicalFollowUp.map(
            (item, index) => (

              <div
                className="care-plan-ai-item"
                key={index}
              >

                <span>
                  →
                </span>

                <p>
                  {item}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    )}


    {/* =========================================
        MONITOR
    ========================================= */}

    {carePlan.monitor?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            15
          </span>

          <div>

            <h3>
              What to Monitor
            </h3>

            <p>
              Things worth tracking over time.
            </p>

          </div>

        </div>


        <div className="care-plan-ai-list">

          {carePlan.monitor.map(
            (item, index) => (

              <div
                className="care-plan-ai-item"
                key={index}
              >

                <span>
                  ⏱
                </span>

                <p>
                  {item}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    )}


    {/* =========================================
        PRECAUTIONS
    ========================================= */}

    {carePlan.precautions?.length > 0 && (

      <div className="form-section">

        <div className="form-section-title">

          <span className="section-number">
            16
          </span>

          <div>

            <h3>
              Precautions
            </h3>

            <p>
              Important things to keep in mind.
            </p>

          </div>

        </div>


        <div className="care-plan-ai-list">

          {carePlan.precautions.map(
            (item, index) => (

              <div
                className="care-plan-ai-item care-plan-ai-item-caution"
                key={index}
              >

                <span>
                  !
                </span>

                <p>
                  {item}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    )}


    {/* =========================================
        AI DISCLAIMER
    ========================================= */}

    {carePlan.disclaimer && (

      <div className="privacy-note">

        <span>
          ⚠
        </span>

        <p>
          {carePlan.disclaimer}
        </p>

      </div>

    )}

  </div>

)}

      {/* =============================================
          ACTIONS
      ============================================= */}

      <div className="form-actions">

        <button
          className="secondary-action-btn"
          onClick={() =>
            setCurrentStep(3)
          }
        >
          ← Back
        </button>


        <button
  className="primary-action-btn"
  onClick={generateCarePlan}
  disabled={isGeneratingCarePlan}
>

  {isGeneratingCarePlan
    ? "Generating Your Care Plan..."
    : "Generate My Care Plan"
  }

  <span>
    ✦
  </span>

</button>

      </div>

    </>

  );

};


  // =====================================================
  // MAIN RETURN
  // =====================================================

  return (

    <div className="care-planner-page">


      {/* =============================================
          HEADER
      ============================================= */}

      <section className="care-planner-header">

        <div className="care-planner-title">

          <span className="care-planner-badge">
            AI-POWERED PERSONALIZED CARE
          </span>

          <h1>

            {currentStep === 1
              ? "Let's understand"
              : "Let's understand your"
            }

            <span>

              {currentStep === 1
                ? " your health."
                : " health needs."
              }

            </span>

          </h1>

          <p>

            {currentStep === 1
              ? "Tell us a little about yourself, your lifestyle, and your daily routine. This information helps us personalize your healthcare guidance."
              : "Share relevant health information so we can build a more complete picture before generating personalized guidance."
            }

          </p>

        </div>

      </section>


      {/* =============================================
          PROGRESS STEPS
      ============================================= */}

      <section className="care-progress-container">

        <div className="care-progress">


          {/* STEP 1 */}

          <div
            className={`progress-step ${
              currentStep >= 1
                ? "active"
                : ""
            }`}
          >

            <div className="progress-number">
              1
            </div>

            <div className="progress-text">

              <strong>
                Personal Profile
              </strong>

              <span>
                Basic information
              </span>

            </div>

          </div>


          <div
            className={`progress-line ${
              currentStep >= 2
                ? "active-line"
                : ""
            }`}
          ></div>


          {/* STEP 2 */}

          <div
            className={`progress-step ${
              currentStep >= 2
                ? "active"
                : ""
            }`}
          >

            <div className="progress-number">
              2
            </div>

            <div className="progress-text">

              <strong>
                Health Information
              </strong>

              <span>
                Conditions & history
              </span>

            </div>

          </div>


          <div className="progress-line"></div>

          {/* STEP 3 */}

<div
  className={`progress-step ${
    currentStep >= 3
      ? "active"
      : ""
  }`}
>

            <div className="progress-number">
              3
            </div>

            <div className="progress-text">

              <strong>
                Medical Reports
              </strong>

              <span>
                Optional upload
              </span>

            </div>

          </div>
<div
  className={`progress-line ${
    currentStep >= 4
      ? "active-line"
      : ""
  }`}
></div>

{/* STEP 4 */}

<div
  className={`progress-step ${
    currentStep >= 4
      ? "active"
      : ""
  }`}
>

            <div className="progress-number">
              4
            </div>

            <div className="progress-text">

              <strong>
                Care Plan
              </strong>

              <span>
                Personalized guidance
              </span>

            </div>

          </div>

        </div>

      </section>


{/* =============================================
    MAIN FORM CARD
============================================= */}

<section className="care-form-section">

  <div className="care-form-card">

    {currentStep === 1 &&
      renderStepOne()
    }

    {currentStep === 2 &&
      renderStepTwo()
    }

    {currentStep === 3 &&
      renderStepThree()
    }
    {currentStep === 4 &&
  renderStepFour()
}

  </div>

</section>

    </div>

  );

}

export default PersonalizedCarePlanner;