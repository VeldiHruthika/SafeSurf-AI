export const conditionData = [
  // =====================================================
  // RESPIRATORY / INFECTION
  // =====================================================

  {
    name: "Common Viral Infection",
    specialist: "General Physician",

    symptoms: {
      Fever: 1.0,
      Cough: 0.9,
      "Sore throat": 0.9,
      "Runny nose": 0.9,
      Cold: 0.8,
      "Body ache": 0.8,
      Fatigue: 0.7,
      Headache: 0.6,
      Chills: 0.6,
      Weakness: 0.5,
      "Muscle pain": 0.7,
      "Appetite loss": 0.5,
      "Poor appetite": 0.5,
    },

    keySymptoms: [
      "Fever",
      "Cough",
      "Sore throat",
      "Runny nose",
      "Body ache",
    ],
  },

  {
    name: "Influenza-like Illness",
    specialist: "General Physician",

    symptoms: {
      Fever: 1.0,
      Cough: 0.9,
      "Body ache": 0.9,
      "Muscle pain": 0.9,
      Headache: 0.8,
      Fatigue: 0.8,
      Chills: 0.8,
      Weakness: 0.6,
      "Sore throat": 0.6,
      Cold: 0.5,
      "Poor appetite": 0.5,
      Nausea: 0.4,
    },

    keySymptoms: [
      "Fever",
      "Cough",
      "Body ache",
      "Chills",
      "Muscle pain",
    ],
  },

  {
    name: "Upper Respiratory Infection",
    specialist: "General Physician",

    symptoms: {
      Cough: 1.0,
      "Sore throat": 1.0,
      "Runny nose": 0.9,
      Cold: 0.8,
      "Nasal congestion": 0.9,
      Sneezing: 0.7,
      Fever: 0.5,
      Headache: 0.5,
      Fatigue: 0.5,
      "Ear pain": 0.3,
    },

    keySymptoms: [
      "Cough",
      "Sore throat",
      "Runny nose",
      "Nasal congestion",
      "Cold",
    ],
  },

  // =====================================================
  // ALLERGY / ENT
  // =====================================================

  {
    name: "Allergic Rhinitis",
    specialist: "ENT Specialist",

    symptoms: {
      Sneezing: 1.0,
      "Runny nose": 0.9,
      "Itchy eyes": 1.0,
      "Nasal congestion": 0.8,
      Allergy: 1.0,
      "Eye irritation": 0.7,
      "Red eyes": 0.6,
      Itching: 0.5,
      "Sore throat": 0.3,
    },

    keySymptoms: [
      "Sneezing",
      "Itchy eyes",
      "Allergy",
      "Runny nose",
      "Nasal congestion",
    ],
  },

  {
    name: "Possible Sinus-related Symptoms",
    specialist: "ENT Specialist",

    symptoms: {
      "Nasal congestion": 1.0,
      Headache: 0.7,
      "Runny nose": 0.8,
      "Sore throat": 0.4,
      "Eye irritation": 0.3,
      "Ear pain": 0.4,
      Fatigue: 0.4,
    },

    keySymptoms: [
      "Nasal congestion",
      "Headache",
      "Runny nose",
    ],
  },

  {
    name: "Possible Ear-related Condition",
    specialist: "ENT Specialist",

    symptoms: {
      "Ear pain": 1.0,
      Fever: 0.4,
      "Hearing difficulty": 0.8,
      "Nasal congestion": 0.4,
      Cold: 0.3,
    },

    keySymptoms: [
      "Ear pain",
    ],
  },

  // =====================================================
  // HEADACHE / NEUROLOGICAL
  // =====================================================

  {
    name: "Possible Migraine",
    specialist: "Neurologist",

    symptoms: {
      Headache: 0.9,
      Migraine: 1.0,
      Nausea: 0.7,
      Dizziness: 0.6,
      "Sensitivity to light": 1.0,
      "Blurred vision": 0.6,
      Fatigue: 0.4,
    },

    keySymptoms: [
      "Migraine",
      "Sensitivity to light",
      "Nausea",
    ],
  },

  {
    name: "Possible Tension Headache",
    specialist: "General Physician",

    symptoms: {
      Headache: 1.0,
      "Neck pain": 0.7,
      Fatigue: 0.5,
      "Muscle pain": 0.4,
      Anxiety: 0.4,
      Stress: 0.5,
    },

    keySymptoms: [
      "Headache",
      "Neck pain",
    ],
  },

  // =====================================================
  // ANEMIA / GENERAL
  // =====================================================

  {
    name: "Possible Anemia",
    specialist: "General Physician",

    symptoms: {
      Fatigue: 0.8,
      Weakness: 0.8,
      "Low energy": 0.8,
      Dizziness: 0.7,
      Headache: 0.5,
      "Shortness of breath": 0.7,
      Paleness: 1.0,
      "Heavy menstrual bleeding": 0.7,
      "Hair fall": 0.4,
    },

    keySymptoms: [
      "Fatigue",
      "Weakness",
      "Dizziness",
      "Shortness of breath",
      "Heavy menstrual bleeding",
    ],
  },

  // =====================================================
  // GASTROINTESTINAL
  // =====================================================

  {
    name: "Possible Gastrointestinal Condition",
    specialist: "Gastroenterologist",

    symptoms: {
      "Abdominal pain": 0.9,
      "Stomach pain": 0.9,
      Nausea: 0.7,
      Vomiting: 0.8,
      Bloating: 0.8,
      Indigestion: 0.7,
      Diarrhea: 0.8,
      Gas: 0.7,
      Constipation: 0.7,
      "Poor appetite": 0.6,
      "Appetite loss": 0.6,
    },

    keySymptoms: [
      "Abdominal pain",
      "Stomach pain",
      "Nausea",
      "Vomiting",
      "Bloating",
    ],
  },

  {
    name: "Possible Acid Reflux / GERD",
    specialist: "Gastroenterologist",

    symptoms: {
      "Acid reflux": 1.0,
      Heartburn: 1.0,
      Indigestion: 0.8,
      "Stomach pain": 0.5,
      "Abdominal pain": 0.4,
      Bloating: 0.5,
      Nausea: 0.4,
      Gas: 0.4,
    },

    keySymptoms: [
      "Acid reflux",
      "Heartburn",
      "Indigestion",
    ],
  },

  {
    name: "Possible Constipation",
    specialist: "General Physician",

    symptoms: {
      Constipation: 1.0,
      Bloating: 0.7,
      Gas: 0.6,
      "Abdominal pain": 0.6,
      "Stomach pain": 0.5,
      "Poor appetite": 0.4,
    },

    keySymptoms: [
      "Constipation",
      "Bloating",
      "Abdominal pain",
    ],
  },

  // =====================================================
  // URINARY
  // =====================================================

  {
    name: "Urinary Tract Infection",
    specialist: "General Physician",

    symptoms: {
      "Burning urination": 1.0,
      "Urinary discomfort": 1.0,
      "Frequent urination": 0.9,
      "Lower abdominal pain": 0.9,
      Fever: 0.5,
      Chills: 0.5,
      Weakness: 0.3,
    },

    keySymptoms: [
      "Burning urination",
      "Urinary discomfort",
      "Frequent urination",
      "Lower abdominal pain",
    ],
  },

  {
    name: "Possible Urinary Control Issue",
    specialist: "Urologist",

    symptoms: {
      "Urinary leakage": 1.0,
      "Frequent urination": 0.7,
      "Urinary discomfort": 0.4,
      "Lower abdominal pain": 0.3,
    },

    keySymptoms: [
      "Urinary leakage",
      "Frequent urination",
    ],
  },

  {
    name: "Possible Blood Sugar Related Symptoms",
    specialist: "General Physician",

    symptoms: {
      "Frequent urination": 0.7,
      Fatigue: 0.6,
      Weakness: 0.5,
      "Excessive thirst": 1.0,
      "Increased hunger": 0.8,
      "Unexplained weight loss": 1.0,
      "Blurred vision": 0.7,
    },

    keySymptoms: [
      "Excessive thirst",
      "Increased hunger",
      "Unexplained weight loss",
    ],
  },

  // =====================================================
  // MENSTRUAL / WOMEN'S HEALTH
  // =====================================================

  {
    name: "Menstrual-related Symptoms",
    specialist: "Gynecologist",

    symptoms: {
      "Menstrual cramps": 1.0,
      "Period pain": 1.0,
      Cramps: 0.8,
      "Breast tenderness": 0.7,
      "Menstrual bleeding": 0.6,
      Periods: 0.5,
      Fatigue: 0.4,
      Headache: 0.4,
      Bloating: 0.5,
    },

    keySymptoms: [
      "Menstrual cramps",
      "Period pain",
      "Breast tenderness",
    ],
  },

  {
    name: "Possible Dysmenorrhea",
    specialist: "Gynecologist",

    symptoms: {
      "Menstrual cramps": 1.0,
      "Period pain": 1.0,
      Cramps: 0.9,
      "Lower abdominal pain": 0.8,
      "Back pain": 0.5,
      Nausea: 0.3,
      Headache: 0.3,
    },

    keySymptoms: [
      "Menstrual cramps",
      "Period pain",
      "Lower abdominal pain",
    ],
  },

  {
    name: "Possible Menstrual Blood Loss-related Concern",
    specialist: "Gynecologist",

    symptoms: {
      "Heavy menstrual bleeding": 1.0,
      "Menstrual bleeding": 0.8,
      Fatigue: 0.6,
      Weakness: 0.6,
      Dizziness: 0.5,
      "Shortness of breath": 0.4,
    },

    keySymptoms: [
      "Heavy menstrual bleeding",
      "Fatigue",
      "Weakness",
    ],
  },

  {
    name: "Possible Vaginal Health Concern",
    specialist: "Gynecologist",

    symptoms: {
      "Vaginal discharge": 1.0,
      Itching: 0.5,
      "Lower abdominal pain": 0.4,
      "Urinary discomfort": 0.4,
    },

    keySymptoms: [
      "Vaginal discharge",
    ],
  },

  // =====================================================
  // SKIN / HAIR / SCALP
  // =====================================================

  {
    name: "Possible Acne",
    specialist: "Dermatologist",

    symptoms: {
      Acne: 1.0,
      Pimples: 1.0,
      "Oily skin": 0.8,
      "Sensitive skin": 0.3,
      "Skin irritation": 0.3,
    },

    keySymptoms: [
      "Acne",
      "Pimples",
      "Oily skin",
    ],
  },

  {
    name: "Possible Dermatitis / Skin Irritation",
    specialist: "Dermatologist",

    symptoms: {
      "Skin irritation": 1.0,
      "Sensitive skin": 0.9,
      Itching: 0.9,
      Rash: 0.8,
      "Dry skin": 0.8,
    },

    keySymptoms: [
      "Skin irritation",
      "Itching",
      "Rash",
    ],
  },

  {
    name: "Possible Skin Allergy",
    specialist: "Dermatologist",

    symptoms: {
      Allergy: 1.0,
      Itching: 0.9,
      Rash: 0.9,
      "Skin irritation": 0.8,
      "Sensitive skin": 0.7,
      Swelling: 0.5,
    },

    keySymptoms: [
      "Allergy",
      "Itching",
      "Rash",
    ],
  },

  {
    name: "Possible Dandruff / Scalp Condition",
    specialist: "Dermatologist",

    symptoms: {
      Dandruff: 1.0,
      "Flaky scalp": 1.0,
      "Dry scalp": 0.9,
      "Itchy scalp": 0.9,
      "Oily scalp": 0.7,
    },

    keySymptoms: [
      "Dandruff",
      "Flaky scalp",
      "Itchy scalp",
    ],
  },

  {
    name: "Possible Hair and Scalp Concern",
    specialist: "Dermatologist",

    symptoms: {
      "Hair fall": 1.0,
      "Dry hair": 0.7,
      "Oily scalp": 0.5,
      "Dry scalp": 0.5,
      Fatigue: 0.3,
    },

    keySymptoms: [
      "Hair fall",
    ],
  },

  // =====================================================
  // EYE
  // =====================================================

  {
    name: "Possible Eye Irritation",
    specialist: "Ophthalmologist",

    symptoms: {
      "Eye irritation": 1.0,
      "Dry eyes": 0.9,
      "Red eyes": 0.8,
      "Itchy eyes": 0.7,
    },

    keySymptoms: [
      "Eye irritation",
      "Dry eyes",
      "Red eyes",
    ],
  },

  // =====================================================
  // DENTAL / ORAL
  // =====================================================

  {
    name: "Possible Dental Condition",
    specialist: "Dentist",

    symptoms: {
      Toothache: 1.0,
      "Tooth sensitivity": 0.9,
      "Sensitive teeth": 0.9,
      "Gum sensitivity": 0.8,
      "Mouth ulcers": 0.5,
      "Bad breath": 0.6,
    },

    keySymptoms: [
      "Toothache",
      "Tooth sensitivity",
      "Gum sensitivity",
    ],
  },

  {
    name: "Possible Oral Hygiene-related Concern",
    specialist: "Dentist",

    symptoms: {
      "Bad breath": 1.0,
      "Gum sensitivity": 0.8,
      "Sensitive teeth": 0.6,
      "Tooth sensitivity": 0.6,
    },

    keySymptoms: [
      "Bad breath",
      "Gum sensitivity",
    ],
  },

  // =====================================================
  // MUSCULOSKELETAL
  // =====================================================

  {
    name: "Possible Musculoskeletal Pain",
    specialist: "Orthopedic Specialist",

    symptoms: {
      "Back pain": 0.9,
      "Joint pain": 0.9,
      "Muscle pain": 0.9,
      "Knee pain": 0.9,
      "Ankle pain": 0.9,
      "Neck pain": 0.8,
      Pain: 0.7,
      Swelling: 0.5,
    },

    keySymptoms: [
      "Joint pain",
      "Muscle pain",
      "Back pain",
      "Knee pain",
      "Ankle pain",
    ],
  },

  {
    name: "Possible Joint-related Condition",
    specialist: "Orthopedic Specialist",

    symptoms: {
      "Joint pain": 1.0,
      "Knee pain": 0.9,
      "Ankle pain": 0.9,
      Swelling: 0.6,
      Pain: 0.7,
    },

    keySymptoms: [
      "Joint pain",
      "Knee pain",
      "Ankle pain",
    ],
  },

  // =====================================================
  // DEHYDRATION
  // =====================================================

  {
    name: "Possible Dehydration",
    specialist: "General Physician",

    symptoms: {
      Dehydration: 1.0,
      "Dry lips": 0.8,
      Weakness: 0.7,
      Fatigue: 0.6,
      Dizziness: 0.6,
      Headache: 0.5,
      "Low energy": 0.5,
    },

    keySymptoms: [
      "Dehydration",
      "Dry lips",
      "Weakness",
    ],
  },

  // =====================================================
  // GASTROINTESTINAL INFECTION
  // =====================================================

  {
    name: "Possible Gastrointestinal Infection",
    specialist: "General Physician",

    symptoms: {
      Diarrhea: 1.0,
      Vomiting: 0.9,
      Nausea: 0.8,
      "Abdominal pain": 0.7,
      "Stomach pain": 0.7,
      Fever: 0.5,
      Weakness: 0.5,
      Dehydration: 0.7,
    },

    keySymptoms: [
      "Diarrhea",
      "Vomiting",
      "Nausea",
    ],
  },

  // =====================================================
  // GENERAL FATIGUE
  // =====================================================

  {
    name: "Possible General Fatigue-related Concern",
    specialist: "General Physician",

    symptoms: {
      Fatigue: 1.0,
      "Low energy": 0.9,
      Weakness: 0.8,
      Dizziness: 0.5,
      "Poor appetite": 0.4,
      "Appetite loss": 0.4,
    },

    keySymptoms: [
      "Fatigue",
      "Low energy",
      "Weakness",
    ],
  },
];