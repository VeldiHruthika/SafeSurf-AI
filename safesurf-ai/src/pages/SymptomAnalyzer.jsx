import { useState } from "react";
import { symptoms } from "../data/symptoms";
import { API_BASE } from "../api";

function SymptomAnalyzer() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("All");

  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // ALPHABET
  // =====================================================

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // =====================================================
  // FILTER SYMPTOMS
  // =====================================================

  const filteredSymptoms = symptoms.filter((symptom) => {
    const matchesSearch = symptom
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLetter =
      selectedLetter === "All" ||
      symptom.toUpperCase().startsWith(selectedLetter);

    return matchesSearch && matchesLetter;
  });

  // =====================================================
  // TOGGLE SYMPTOM
  // =====================================================

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(
        selectedSymptoms.filter((item) => item !== symptom)
      );
    } else {
      setSelectedSymptoms([
        ...selectedSymptoms,
        symptom,
      ]);
    }
  };

  // =====================================================
  // EMERGENCY SYMPTOMS
  // =====================================================

  const emergencySymptoms = [
    "Chest pain",
    "Chest discomfort",
    "Severe chest pain",
    "Shortness of breath",
    "Difficulty breathing",
    "Sudden collapse",
    "No pulse",
    "No breathing",
    "Unconsciousness",
    "Loss of consciousness",
    "Seizures",
  ];

  // =====================================================
  // ANALYZE SYMPTOMS
  // =====================================================

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      return;
    }

    setLoading(true);
    setError("");

    // ===================================================
    // EMERGENCY CHECK
    // ===================================================

    const emergencyDetected = selectedSymptoms.some((symptom) =>
      emergencySymptoms.includes(symptom)
    );

    if (emergencyDetected) {
      setShowResults(true);

      setAnalysis({
        emergency: true,

        possible_conditions: [],

        description:
          "Some of the symptoms you selected may require immediate medical attention.",

        recommendation:
          "Please seek emergency medical care immediately or contact your local emergency service.",

        warning_signs: [
          "Severe or worsening symptoms",
          "Difficulty breathing",
          "Loss of consciousness",
          "Severe chest pain",
        ],
      });

      setLoading(false);
      return;
    }

    // ===================================================
    // SEND SYMPTOMS TO BACKEND
    // ===================================================

    try {
      const response = await fetch(
        `${API_BASE}/api/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            symptoms: selectedSymptoms,
          }),
        }
      );

      // =================================================
      // CHECK HTTP RESPONSE
      // =================================================

      if (!response.ok) {
        throw new Error(
          "Unable to connect to SafeSurf AI backend."
        );
      }

      const data = await response.json();

      console.log("Backend response:", data);

      // =================================================
      // CHECK BACKEND SUCCESS
      // =================================================

      if (!data.success) {
        throw new Error(
          data.error || "Analysis failed."
        );
      }

      // =================================================
      // IMPORTANT DATA MAPPING
      //
      // Backend returns:
      //
      // conditionMatches
      // analysis
      //
      // Frontend results page expects:
      //
      // possible_conditions
      // description
      // recommendation
      // warning_signs
      // =================================================

      setAnalysis({
        emergency: false,

        possible_conditions:
          Array.isArray(data.conditionMatches)
            ? data.conditionMatches
            : [],

        description:
          data.analysis?.description ||
          "Your selected symptoms can have several possible causes.",

        recommendation:
          data.analysis?.recommendation ||
          "Consider consulting a healthcare professional if your symptoms persist or worsen.",

        warning_signs:
          Array.isArray(data.analysis?.warning_signs)
            ? data.analysis.warning_signs
            : [],
      });

      setShowResults(true);

    } catch (error) {
      console.error(
        "Analysis error:",
        error
      );

      setError(
        "Unable to analyze your symptoms right now. Please make sure the SafeSurf AI backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ANALYZE AGAIN
  // =====================================================

  const analyzeAgain = () => {
    setShowResults(false);
    setAnalysis(null);
    setError("");
  };

  // =====================================================
  // RESULTS PAGE
  // =====================================================

  if (showResults && analysis) {
    return (
      <div className="symptom-page">

        {/* HEADER */}

        <section className="symptom-header">

          <div className="symptom-badge">
            ✦ AI HEALTH TOOL
          </div>

          <h1>
            SafeSurf AI Analysis
          </h1>

          <p>
            Your symptom analysis results
          </p>

        </section>

        {/* RESULTS */}

        <section className="symptom-wrapper">

          <div className="symptom-card">

            {/* =================================================
                EMERGENCY RESULT
            ================================================= */}

            {analysis.emergency ? (

              <div className="emergency-box">

                <div className="emergency-icon">
                  ⚠
                </div>

                <span>
                  EMERGENCY
                </span>

                <h2>
                  Immediate medical attention may be required
                </h2>

                <p>
                  Some symptoms you selected may indicate
                  a situation that requires urgent professional
                  medical evaluation.
                </p>

                <div className="warning-section">

                  <h3>
                    Recommended action
                  </h3>

                  <p>
                    {analysis.recommendation}
                  </p>

                </div>

              </div>

            ) : (

              <>

                {/* =================================================
                    POSSIBLE CONDITIONS
                ================================================= */}

                <div className="condition-box">

                  <span>
                    POSSIBLE CONDITIONS
                  </span>

                  <h2>
                    Based on your selected symptoms
                  </h2>

                  <p className="match-explanation">
                    These percentages represent a
                    <strong> symptom-match score</strong>,
                    not a medical diagnosis.
                  </p>

                  {/* CONDITION RESULTS */}

                  {analysis.possible_conditions &&
                  analysis.possible_conditions.length > 0 ? (

                    <div className="condition-results">

                      {analysis.possible_conditions.map(
                        (condition, index) => (

                          <div
                            className="condition-result"
                            key={condition.name}
                          >

                            <div className="condition-info">

                              <span className="condition-number">
                                {index + 1}
                              </span>

                              <div>

                                <h3>
                                  {condition.name}
                                </h3>

                                <p>
                                  {condition.specialist}
                                </p>

                              </div>

                            </div>

                            <div className="condition-score">

                              <strong>
                                {condition.score}%
                              </strong>

                              <span>
                                symptom match
                              </span>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="no-match">

                      <h3>
                        No strong predefined condition matches were found.
                      </h3>

                      <p>
                        Further evaluation by a healthcare
                        professional is recommended.
                      </p>

                    </div>

                  )}

                </div>

                {/* =================================================
                    SYMPTOMS CONSIDERED
                ================================================= */}

                <div className="considered-section">

                  <h3>
                    Symptoms considered
                  </h3>

                  <div className="considered-list">

                    {selectedSymptoms.map((symptom) => (

                      <div
                        className="considered-item"
                        key={symptom}
                      >

                        <span>
                          ✓
                        </span>

                        {symptom}

                      </div>

                    ))}

                  </div>

                </div>

                {/* =================================================
                    GEMINI DESCRIPTION
                ================================================= */}

                {analysis.description && (

                  <div className="analysis-description">

                    <h3>
                      What this may mean
                    </h3>

                    <p>
                      {analysis.description}
                    </p>

                  </div>

                )}

                {/* =================================================
                    RECOMMENDED NEXT STEP
                ================================================= */}

                {analysis.recommendation && (

                  <div className="recommendation-box">

                    <span>
                      ♧
                    </span>

                    <div>

                      <h3>
                        RECOMMENDED NEXT STEP
                      </h3>

                      <p>
                        {analysis.recommendation}
                      </p>

                    </div>

                  </div>

                )}

                {/* =================================================
                    WARNING SIGNS
                ================================================= */}

                {analysis.warning_signs &&
                analysis.warning_signs.length > 0 && (

                  <div className="warning-section">

                    <div className="warning-title">

                      <span>
                        ⚠
                      </span>

                      <h3>
                        Warning signs
                      </h3>

                    </div>

                    <p>
                      Seek medical attention if you
                      experience any of the following.
                    </p>

                    <ul>

                      {analysis.warning_signs.map(
                        (warning, index) => (

                          <li key={index}>
                            {warning}
                          </li>

                        )
                      )}

                    </ul>

                  </div>

                )}

              </>

            )}

            {/* =================================================
                DISCLAIMER
            ================================================= */}

            <div className="symptom-disclaimer">

              ⚠ Important

              <p>
                This is an informational prototype and
                not a medical diagnosis. Symptoms can have
                multiple causes and only a qualified
                healthcare professional can provide an
                appropriate evaluation.
              </p>

            </div>

            {/* =================================================
                ANALYZE AGAIN
            ================================================= */}

            <button
              className="analyze-main-btn"
              onClick={analyzeAgain}
            >
              ← Analyze Again
            </button>

          </div>

        </section>

      </div>
    );
  }

  // =====================================================
  // SYMPTOM SELECTION PAGE
  // =====================================================

  return (
    <div className="symptom-page">

      {/* HEADER */}

      <section className="symptom-header">

        <div className="symptom-badge">
          ✦ AI HEALTH TOOL
        </div>

        <h1>
          Symptom Analyzer
        </h1>

        <p>
          Select the symptoms you're experiencing
          and let SafeSurf AI help you understand
          what they could mean.
        </p>

      </section>

      {/* ANALYZER CARD */}

      <section className="symptom-wrapper">

        <div className="symptom-card">

          {/* TITLE */}

          <div className="symptom-card-title">

            <div>

              <h2>
                What are you experiencing?
              </h2>

              <p>
                Select one or more symptoms.
              </p>

            </div>

            <div className="selected-number">

              {selectedSymptoms.length}

              <span>
                {" "}selected
              </span>

            </div>

          </div>

          {/* SEARCH */}

          <div className="symptom-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search symptoms..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* ALPHABET */}

          <div className="alphabet-filter">

            <button
              className={
                selectedLetter === "All"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedLetter("All")
              }
            >
              All
            </button>

            {alphabet.map((letter) => (

              <button
                key={letter}
                className={
                  selectedLetter === letter
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSelectedLetter(letter)
                }
              >
                {letter}
              </button>

            ))}

          </div>

          {/* SYMPTOM LIST */}

          <div className="symptom-list">

            {filteredSymptoms.length > 0 ? (

              filteredSymptoms.map((symptom) => (

                <button
                  key={symptom}
                  className={
                    selectedSymptoms.includes(symptom)
                      ? "symptom-item active"
                      : "symptom-item"
                  }
                  onClick={() =>
                    toggleSymptom(symptom)
                  }
                >

                  <span className="symptom-check">

                    {selectedSymptoms.includes(symptom)
                      ? "✓"
                      : "+"}

                  </span>

                  {symptom}

                </button>

              ))

            ) : (

              <p className="no-symptoms">
                No symptoms found.
              </p>

            )}

          </div>

          {/* SELECTED */}

          {selectedSymptoms.length > 0 && (

            <div className="selected-section">

              <h3>
                Your symptoms
              </h3>

              <div className="selected-tags">

                {selectedSymptoms.map((symptom) => (

                  <span key={symptom}>

                    {symptom}

                    <button
                      onClick={() =>
                        toggleSymptom(symptom)
                      }
                    >
                      ×
                    </button>

                  </span>

                ))}

              </div>

            </div>

          )}

          {/* ERROR */}

          {error && (

            <div className="analysis-error">
              {error}
            </div>

          )}

          {/* ANALYZE BUTTON */}

          <button
            className="analyze-main-btn"
            disabled={
              selectedSymptoms.length === 0 ||
              loading
            }
            onClick={analyzeSymptoms}
          >

            {loading
              ? "Analyzing..."
              : "✦ Analyze My Symptoms"}

          </button>

          {/* DISCLAIMER */}

          <p className="symptom-disclaimer">

            ⚕ SafeSurf AI provides general health
            information and does not replace professional
            medical advice.

          </p>

        </div>

      </section>

    </div>
  );
}

export default SymptomAnalyzer;