import { useState } from "react";
import "../styles/BodyScopeAI.css";

import bodyFront from "../assets/body-front.png";
import bodyBack from "../assets/body-back.png";
import femaleFront from "../assets/female-front.png";
import femaleBack from "../assets/female-back.png";

function BodyScopeAI({ goHome }) {
  const [selectedPart, setSelectedPart] = useState("");
const [description, setDescription] = useState("");
const [view, setView] = useState("front");

const [symptoms, setSymptoms] = useState([]);
const [painTypes, setPainTypes] = useState([]);
const [severity, setSeverity] = useState(0);

const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
  
  const [gender, setGender] = useState("male");

  // Parts only visible from the front (a face, chest, and abdomen can't be
  // seen from behind) vs. parts only visible from the back (upper/lower
  // back aren't a thing on the front). Everything else is visible from
  // both views, so it's listed in both arrays.
  const frontBodyPartsMale = [
    "Head",
    "Scalp",
    "Face",
    "Eyes",
    "Ears",
    "Nose",
    "Mouth",
    "Jaw",
    "Neck",
    "Throat",
    "Shoulder",
    "Armpit",
    "Chest",
    "Abdomen",
    "Waist",
    "Groin",
    "Upper Arm",
    "Forearm",
    "Elbow",
    "Wrist",
    "Hand",
    "Fingers",
    "Hip",
    "Thigh",
    "Knee",
    "Shin",
    "Ankle",
    "Foot",
    "Toes",
  ];

  // Female front list is identical to the male one, but with "Breast"
  // inserted right after "Chest" - the one region that has no male
  // equivalent and needs its own dedicated hotspot pair (not folded into
  // the generic Chest hotspot), since breast-specific symptoms (lumps,
  // pain, discharge, skin changes) are their own common concern.
  const frontBodyPartsFemale = [
    "Head",
    "Scalp",
    "Face",
    "Eyes",
    "Ears",
    "Nose",
    "Mouth",
    "Jaw",
    "Neck",
    "Throat",
    "Shoulder",
    "Armpit",
    "Chest",
    "Breast",
    "Abdomen",
    "Waist",
    "Groin",
    "Upper Arm",
    "Forearm",
    "Elbow",
    "Wrist",
    "Hand",
    "Fingers",
    "Hip",
    "Thigh",
    "Knee",
    "Shin",
    "Ankle",
    "Foot",
    "Toes",
  ];

  const backBodyParts = [
    "Head",
    "Scalp",
    "Ears",
    "Neck",
    "Shoulder",
    "Spine",
    "Upper Back",
    "Lower Back",
    "Waist",
    "Buttocks",
    "Upper Arm",
    "Forearm",
    "Elbow",
    "Wrist",
    "Hand",
    "Fingers",
    "Hip",
    "Thigh",
    "Knee",
    "Calf",
    "Ankle",
  ];
  const symptomOptions = [
  "Pain",
  "Swelling",
  "Itching",
  "Burning",
  "Numbness",
  "Tingling",
  "Stiffness",
  "Weakness",
  "Rash",
  "Bleeding",
  "Discharge",
  "Lump",
  "Other",
];

const painTypeOptions = [
  "Sharp",
  "Stabbing",
  "Shooting",
  "Pulling",
  "Burning",
  "Electric / Shock-like",
  "Aching",
  "Dull",
  "Throbbing",
  "Cramping",
  "Pressure / Tightness",
];

  // Back-view anatomy (shoulder blades, spine, glutes, hamstrings) doesn't
  // need different part names between genders - only the underlying
  // hotspot coordinates (via the "-female" class suffix) change to match
  // the female reference image's proportions.
  const frontBodyParts =
    gender === "female" ? frontBodyPartsFemale : frontBodyPartsMale;

  const bodyParts = view === "front" ? frontBodyParts : backBodyParts;

  const handleSelectPart = (part) => {
    setSelectedPart(part);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setSelectedPart("");
  };

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    setSelectedPart("");
  };
  


const toggleSelection = (item, setter) => {
  setter((previous) => {
    if (previous.includes(item)) {
      return previous.filter(
        (value) => value !== item
      );
    }

    return [...previous, item];
  });
};


  const handleAnalyze = async () => {
  setError("");
  setAnalysis(null);

  if (!selectedPart) {
    setError("Please select a body part.");
    return;
  }

  if (symptoms.length === 0) {
    setError("Please select at least one symptom.");
    return;
  }

  if (symptoms.includes("Pain") && painTypes.length === 0) {
    setError("Please select the type of pain you are experiencing.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:5000/api/bodyscope/analyze",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          bodyPart: selectedPart,
          gender: gender,
          view: view,
          symptoms: symptoms,
          painTypes: painTypes,
          severity:
            symptoms.includes("Pain")
              ? Number(severity)
              : null,
          description: description,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
          "Unable to analyze your symptoms."
      );
    }

    setAnalysis(data.analysis);

  } catch (err) {
    console.error("BodyScope AI error:", err);

    setError(
      err.message ||
        "Something went wrong. Please try again."
    );

  } finally {
    setLoading(false);
  }
};

  const createHotspot = (
    part,
    className,
    label = part
  ) => {
    // Each body part has separate front/back coordinates in the CSS
    // (the pose differs enough between views that one shared position
    // doesn't line up on both images), so the active view is appended
    // to the class name, e.g. "hotspot-arm-left-front". Female anatomy
    // (different proportions - narrower shoulders, wider hips, bust,
    // etc.) gets its own pixel-measured coordinate set per part, so a
    // "-female" suffix is appended on top of that when gender is
    // female, e.g. "hotspot-arm-left-front-female". Male hotspots keep
    // their original class names unchanged.
    const viewClassName = `${className}-${view}${
      gender === "female" ? "-female" : ""
    }`;

    return (
      <button
        key={`${gender}-${view}-${part}-${className}`}
        type="button"
        className={`body-hotspot ${viewClassName} ${
          selectedPart === part ? "active" : ""
        }`}
        onClick={() => handleSelectPart(part)}
        aria-label={`Select ${label}`}
        title={label}
      />
    );
  };

  const bodyImageSrc =
    gender === "female"
      ? view === "front"
        ? femaleFront
        : femaleBack
      : view === "front"
      ? bodyFront
      : bodyBack;

  const bodyImageAlt =
    gender === "female"
      ? view === "front"
        ? "Front anatomical female body"
        : "Back anatomical female body"
      : view === "front"
      ? "Front anatomical male body"
      : "Back anatomical male body";

  return (
    <div className="bodyscope-page">

      {/* ================= HERO ================= */}

      <div className="bodyscope-hero">


        <div className="bodyscope-badge">
          ♡ INTERACTIVE BODY EXPLORER
        </div>

        <h1>
          Explore your body with
          <span> BodyScope AI</span>
        </h1>

        <p>
          Select a body area, describe what you are feeling,
          and receive AI-powered general health information.
        </p>

      </div>


      {/* ================= MAIN CARD ================= */}

      <div className="bodyscope-card">


        {/* ================= LEFT SIDE ================= */}

        <div className="body-map-section">

          <div className="body-map-header">

            <div>
              <h2>Select a body area</h2>

              <p>
                Click directly on the body or choose an area below.
              </p>
            </div>

            <div className="body-toggles-column">

              {/* MALE / FEMALE */}

              <div
                className="body-view-toggle body-gender-toggle"
                role="group"
                aria-label="Choose body type"
              >

                <button
                  type="button"
                  className={
                    gender === "male"
                      ? "view-btn active"
                      : "view-btn"
                  }
                  onClick={() => handleGenderChange("male")}
                >
                  Male
                </button>

                <button
                  type="button"
                  className={
                    gender === "female"
                      ? "view-btn active"
                      : "view-btn"
                  }
                  onClick={() => handleGenderChange("female")}
                >
                  Female
                </button>

              </div>

              {/* FRONT / BACK */}

              <div
                className="body-view-toggle"
                role="group"
                aria-label="Choose front or back view"
              >

                <button
                  type="button"
                  className={
                    view === "front"
                      ? "view-btn active"
                      : "view-btn"
                  }
                  onClick={() => handleViewChange("front")}
                >
                  Front
                </button>

                <button
                  type="button"
                  className={
                    view === "back"
                      ? "view-btn active"
                      : "view-btn"
                  }
                  onClick={() => handleViewChange("back")}
                >
                  Back
                </button>

              </div>

            </div>

          </div>


          {/* ================= BODY IMAGE ================= */}

          <div className="body-image-wrapper">

            <img
              src={bodyImageSrc}
              alt={bodyImageAlt}
              className="anatomical-body-image"
            />


            {/* ================= FRONT HOTSPOTS ================= */}

            {view === "front" && (
              <div className="body-hotspots">

                {createHotspot(
                  "Head",
                  "hotspot-head",
                  "Head"
                )}

                {createHotspot(
                  "Scalp",
                  "hotspot-scalp",
                  "Scalp"
                )}

                {createHotspot(
                  "Face",
                  "hotspot-face",
                  "Face"
                )}

                {createHotspot(
                  "Eyes",
                  "hotspot-eyes",
                  "Eyes"
                )}

                {createHotspot(
                  "Ears",
                  "hotspot-ear-left",
                  "Ears"
                )}

                {createHotspot(
                  "Ears",
                  "hotspot-ear-right",
                  "Ears"
                )}

                {createHotspot(
                  "Nose",
                  "hotspot-nose",
                  "Nose"
                )}

                {createHotspot(
                  "Mouth",
                  "hotspot-mouth",
                  "Mouth"
                )}

                {createHotspot(
                  "Jaw",
                  "hotspot-jaw",
                  "Jaw"
                )}

                {createHotspot(
                  "Neck",
                  "hotspot-neck",
                  "Neck"
                )}

                {createHotspot(
                  "Throat",
                  "hotspot-throat",
                  "Throat"
                )}

                {createHotspot(
                  "Shoulder",
                  "hotspot-shoulder-left",
                  "Shoulder"
                )}

                {createHotspot(
                  "Shoulder",
                  "hotspot-shoulder-right",
                  "Shoulder"
                )}

                {createHotspot(
                  "Armpit",
                  "hotspot-armpit-left",
                  "Armpit"
                )}

                {createHotspot(
                  "Armpit",
                  "hotspot-armpit-right",
                  "Armpit"
                )}

                {createHotspot(
                  "Chest",
                  "hotspot-chest",
                  "Chest"
                )}

                {/* Breast hotspots only exist on the female front view -
                    positioned over each bust, measured independently of
                    the (higher, narrower) Chest/sternum hotspot above. */}

                {gender === "female" && (
                  <>
                    {createHotspot(
                      "Breast",
                      "hotspot-breast-left",
                      "Breast"
                    )}

                    {createHotspot(
                      "Breast",
                      "hotspot-breast-right",
                      "Breast"
                    )}
                  </>
                )}

                {createHotspot(
                  "Abdomen",
                  "hotspot-abdomen",
                  "Abdomen"
                )}

                {createHotspot(
                  "Waist",
                  "hotspot-waist",
                  "Waist"
                )}

                {createHotspot(
                  "Groin",
                  "hotspot-groin",
                  "Groin"
                )}

                {createHotspot(
                  "Upper Arm",
                  "hotspot-arm-left",
                  "Upper Arm"
                )}

                {createHotspot(
                  "Upper Arm",
                  "hotspot-arm-right",
                  "Upper Arm"
                )}

                {createHotspot(
                  "Forearm",
                  "hotspot-forearm-left",
                  "Forearm"
                )}

                {createHotspot(
                  "Forearm",
                  "hotspot-forearm-right",
                  "Forearm"
                )}

                {createHotspot(
                  "Elbow",
                  "hotspot-elbow-left",
                  "Elbow"
                )}

                {createHotspot(
                  "Elbow",
                  "hotspot-elbow-right",
                  "Elbow"
                )}

                {createHotspot(
                  "Wrist",
                  "hotspot-wrist-left",
                  "Wrist"
                )}

                {createHotspot(
                  "Wrist",
                  "hotspot-wrist-right",
                  "Wrist"
                )}

                {createHotspot(
                  "Hand",
                  "hotspot-hand-left",
                  "Hand"
                )}

                {createHotspot(
                  "Hand",
                  "hotspot-hand-right",
                  "Hand"
                )}

                {createHotspot(
                  "Fingers",
                  "hotspot-fingers-left",
                  "Fingers"
                )}

                {createHotspot(
                  "Fingers",
                  "hotspot-fingers-right",
                  "Fingers"
                )}

                {createHotspot(
                  "Hip",
                  "hotspot-hip-left",
                  "Hip"
                )}

                {createHotspot(
                  "Hip",
                  "hotspot-hip-right",
                  "Hip"
                )}

                {createHotspot(
                  "Thigh",
                  "hotspot-thigh-left",
                  "Thigh"
                )}

                {createHotspot(
                  "Thigh",
                  "hotspot-thigh-right",
                  "Thigh"
                )}

                {createHotspot(
                  "Knee",
                  "hotspot-knee-left",
                  "Knee"
                )}

                {createHotspot(
                  "Knee",
                  "hotspot-knee-right",
                  "Knee"
                )}

                {createHotspot(
                  "Shin",
                  "hotspot-leg-left",
                  "Shin"
                )}

                {createHotspot(
                  "Shin",
                  "hotspot-leg-right",
                  "Shin"
                )}

                {createHotspot(
                  "Ankle",
                  "hotspot-ankle-left",
                  "Ankle"
                )}

                {createHotspot(
                  "Ankle",
                  "hotspot-ankle-right",
                  "Ankle"
                )}

                {createHotspot(
                  "Foot",
                  "hotspot-foot-left",
                  "Foot"
                )}

                {createHotspot(
                  "Foot",
                  "hotspot-foot-right",
                  "Foot"
                )}

                {createHotspot(
                  "Toes",
                  "hotspot-toes-left",
                  "Toes"
                )}

                {createHotspot(
                  "Toes",
                  "hotspot-toes-right",
                  "Toes"
                )}

              </div>
            )}


            {/* ================= BACK HOTSPOTS ================= */}

            {view === "back" && (
              <div className="body-hotspots">

                {createHotspot(
                  "Head",
                  "hotspot-head",
                  "Head"
                )}

                {createHotspot(
                  "Scalp",
                  "hotspot-scalp",
                  "Scalp"
                )}

                {createHotspot(
                  "Ears",
                  "hotspot-ear-left",
                  "Ears"
                )}

                {createHotspot(
                  "Ears",
                  "hotspot-ear-right",
                  "Ears"
                )}

                {createHotspot(
                  "Neck",
                  "hotspot-neck",
                  "Neck"
                )}

                {createHotspot(
                  "Shoulder",
                  "hotspot-shoulder-left",
                  "Shoulder"
                )}

                {createHotspot(
                  "Shoulder",
                  "hotspot-shoulder-right",
                  "Shoulder"
                )}

                {createHotspot(
                  "Spine",
                  "hotspot-spine",
                  "Spine"
                )}

                {createHotspot(
                  "Upper Back",
                  "hotspot-upperback",
                  "Upper Back"
                )}

                {createHotspot(
                  "Lower Back",
                  "hotspot-lowerback",
                  "Lower Back"
                )}

                {createHotspot(
                  "Waist",
                  "hotspot-waist",
                  "Waist"
                )}

                {createHotspot(
                  "Buttocks",
                  "hotspot-buttocks",
                  "Buttocks"
                )}

                {createHotspot(
                  "Upper Arm",
                  "hotspot-arm-left",
                  "Upper Arm"
                )}

                {createHotspot(
                  "Upper Arm",
                  "hotspot-arm-right",
                  "Upper Arm"
                )}

                {createHotspot(
                  "Forearm",
                  "hotspot-forearm-left",
                  "Forearm"
                )}

                {createHotspot(
                  "Forearm",
                  "hotspot-forearm-right",
                  "Forearm"
                )}

                {createHotspot(
                  "Elbow",
                  "hotspot-elbow-left",
                  "Elbow"
                )}

                {createHotspot(
                  "Elbow",
                  "hotspot-elbow-right",
                  "Elbow"
                )}

                {createHotspot(
                  "Wrist",
                  "hotspot-wrist-left",
                  "Wrist"
                )}

                {createHotspot(
                  "Wrist",
                  "hotspot-wrist-right",
                  "Wrist"
                )}

                {createHotspot(
                  "Hand",
                  "hotspot-hand-left",
                  "Hand"
                )}

                {createHotspot(
                  "Hand",
                  "hotspot-hand-right",
                  "Hand"
                )}

                {createHotspot(
                  "Fingers",
                  "hotspot-fingers-left",
                  "Fingers"
                )}

                {createHotspot(
                  "Fingers",
                  "hotspot-fingers-right",
                  "Fingers"
                )}

                {createHotspot(
                  "Hip",
                  "hotspot-hip-left",
                  "Hip"
                )}

                {createHotspot(
                  "Hip",
                  "hotspot-hip-right",
                  "Hip"
                )}

                {createHotspot(
                  "Thigh",
                  "hotspot-thigh-left",
                  "Thigh"
                )}

                {createHotspot(
                  "Thigh",
                  "hotspot-thigh-right",
                  "Thigh"
                )}

                {createHotspot(
                  "Knee",
                  "hotspot-knee-left",
                  "Knee"
                )}

                {createHotspot(
                  "Knee",
                  "hotspot-knee-right",
                  "Knee"
                )}

                {createHotspot(
                  "Calf",
                  "hotspot-leg-left",
                  "Calf"
                )}

                {createHotspot(
                  "Calf",
                  "hotspot-leg-right",
                  "Calf"
                )}

                {createHotspot(
                  "Ankle",
                  "hotspot-ankle-left",
                  "Ankle"
                )}

                {createHotspot(
                  "Ankle",
                  "hotspot-ankle-right",
                  "Ankle"
                )}

              </div>
            )}

          </div>


          {/* SELECTED AREA */}

          <div className="body-selection-status">

            <span className="selection-dot"></span>

            <span>
              {selectedPart
                ? `Selected: ${selectedPart}`
                : "Select an area of the body"}
            </span>

          </div>

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div className="body-details-section">

          <div className="details-heading">

            <span className="details-icon">
              ✦
            </span>

            <div>
              <h2>What are you feeling?</h2>

              <p>
                Tell BodyScope AI what you're experiencing.
              </p>
            </div>

          </div>



          {/* SELECTED BODY PART */}

          <div className="selected-area-box">

            <span>
              Selected body area
            </span>

            <strong>
              {selectedPart || "No body part selected"}
            </strong>

          </div>


          {/* BODY PART BUTTONS */}

          <div className="body-part-selection">

            <h3>Or choose an area</h3>

            <div className="body-part-buttons">

              {bodyParts.map((part) => (

                <button
                  key={part}
                  type="button"
                  className={
                    selectedPart === part
                      ? "body-option active"
                      : "body-option"
                  }
                  onClick={() =>
                    handleSelectPart(part)
                  }
                >
                  {part}
                </button>

              ))}

            </div>

          </div>


          {/* DESCRIPTION */}

          {/* ================= SYMPTOMS ================= */}

<div className="bodyscope-question">

  <h3>What are you experiencing?</h3>

  <p>
    Select everything that applies.
  </p>

  <div className="body-part-buttons">

    {symptomOptions.map((symptom) => (

      <button
        key={symptom}
        type="button"
        className={
          symptoms.includes(symptom)
            ? "body-option active"
            : "body-option"
        }
        onClick={() =>
          toggleSelection(symptom, setSymptoms)
        }
      >
        {symptom}
      </button>

    ))}

  </div>

</div>


{/* ================= PAIN TYPE ================= */}

{symptoms.includes("Pain") && (

  <div className="bodyscope-question">

    <h3>What kind of pain is it?</h3>

    <p>
      You can select more than one.
    </p>

    <div className="body-part-buttons">

      {painTypeOptions.map((pain) => (

        <button
          key={pain}
          type="button"
          className={
            painTypes.includes(pain)
              ? "body-option active"
              : "body-option"
          }
          onClick={() =>
            toggleSelection(pain, setPainTypes)
          }
        >
          {pain}
        </button>

      ))}

    </div>

  </div>

)}


{/* ================= PAIN SEVERITY ================= */}

{symptoms.includes("Pain") && (

  <div className="bodyscope-question pain-severity">

    <div className="severity-heading">

      <div>

        <h3>
          How severe is the pain?
        </h3>

        <p>
          0 means no pain and 10 means the worst pain.
        </p>

      </div>

      <strong>
        {severity}/10
      </strong>

    </div>

    <input
      type="range"
      min="0"
      max="10"
      value={severity}
      onChange={(e) =>
        setSeverity(Number(e.target.value))
      }
    />

    <div className="severity-labels">

      <span>0 — No pain</span>

      <span>10 — Worst pain</span>

    </div>

  </div>

)}


{/* ================= ADDITIONAL DETAILS ================= */}

<label className="bodyscope-label">

  <span>
    Anything else you want to add?
  </span>

  <textarea
    value={description}
    onChange={(e) =>
      setDescription(e.target.value)
    }
    placeholder="For example: When did it start? Does anything make it better or worse? Are there any other symptoms?"
  />

</label>


{/* ================= ERROR ================= */}

{error && (

  <div className="bodyscope-error">

    {error}

  </div>

)}


{/* ================= ANALYZE ================= */}

<button
  type="button"
  className="bodyscope-analyze-btn"
  onClick={handleAnalyze}
  disabled={loading}
>
  {loading
    ? "Analyzing..."
    : "✦ Analyze with BodyScope AI"
  }
</button>

        </div>

           </div>


      {/* ================= AI RESULT ================= */}

      {analysis && (

        <div className="bodyscope-result">

          <h2>BodyScope AI Analysis</h2>


          {/* SUMMARY */}

          <div className="result-section">

            <h3>Summary</h3>

            <p>
              {analysis.summary}
            </p>

          </div>


          {/* POSSIBLE CAUSES */}

          <div className="result-section">

            <h3>Possible General Causes</h3>

            <ul className="result-list">

              {analysis.possible_causes?.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                )
              )}

            </ul>

          </div>


          {/* WHAT TO MONITOR */}

          <div className="result-section">

            <h3>What to Monitor</h3>

            <ul className="result-list">

              {analysis.what_to_monitor?.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                )
              )}

            </ul>

          </div>


          {/* NEXT STEPS */}

          <div className="result-section">

            <h3>Suggested Next Steps</h3>

            <ul className="result-list">

              {analysis.next_steps?.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                )
              )}

            </ul>

          </div>


          {/* URGENT WARNING */}

          <div className="bodyscope-warning">

            <strong>
              When to seek urgent help:
            </strong>

            <p>
              {analysis.urgent_warning}
            </p>

          </div>

        </div>

      )}


      {/* ================= DISCLAIMER ================= */}

      <div className="bodyscope-warning">

        <strong>Important:</strong>{" "}
        BodyScope AI provides general educational information
        only and does not diagnose medical conditions or replace
        professional medical advice.

      </div>

    </div>
  );
}

export default BodyScopeAI;