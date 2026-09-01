const products = [

  // =====================================================
  // SKIN & PERSONAL CARE (11)
  // =====================================================

  {
    id: 1,
    name: "Gentle Facial Cleanser",
    category: "Skin & Personal Care",
    description:
      "A gentle cleanser suitable for everyday cleansing of normal, dry, or sensitive skin.",
    keywords: [
      "cleanser", "face wash", "facial cleanser", "face cleanser",
      "dry skin", "sensitive skin", "skin care", "skincare",
      "pimples", "pimple", "acne", "blackheads", "whiteheads",
      "oily skin", "skin irritation",
    ],
    type: "general-health-product",
    searchTerm: "gentle facial cleanser",
  },

  {
    id: 2,
    name: "Moisturizing Lotion",
    category: "Skin & Personal Care",
    description:
      "A moisturizing product intended to help maintain skin hydration and softness.",
    keywords: [
      "moisturizer", "moisturiser", "moisturizing lotion", "moisturising lotion",
      "dry skin", "skin dryness", "dryness", "hydration",
      "skin care", "skincare", "rough skin", "sensitive skin",
    ],
    type: "general-health-product",
    searchTerm: "moisturizing lotion",
  },

  {
    id: 3,
    name: "Sunscreen",
    category: "Skin & Personal Care",
    description:
      "A sunscreen product designed to help protect skin from ultraviolet radiation.",
    keywords: [
      "sunscreen", "sun protection", "spf", "sunblock", "sun block",
      "uv protection", "ultraviolet protection", "skin protection", "sun exposure",
    ],
    type: "general-health-product",
    searchTerm: "sunscreen spf",
  },

  {
    id: 4,
    name: "Anti-Dandruff Shampoo",
    category: "Skin & Personal Care",
    description:
      "A shampoo intended for scalp cleansing and dandruff care.",
    keywords: [
      "shampoo", "dandruff", "itchy scalp", "itching scalp", "scalp care",
      "dry scalp", "flaky scalp", "flakes", "scalp irritation",
    ],
    type: "general-health-product",
    searchTerm: "anti dandruff shampoo",
  },

  {
    id: 5,
    name: "Lip Balm",
    category: "Skin & Personal Care",
    description:
      "A moisturizing lip balm intended to relieve and protect dry or chapped lips.",
    keywords: [
      "lip balm", "chapped lips", "dry lips", "cracked lips", "lip care", "lip moisturizer",
    ],
    type: "general-health-product",
    searchTerm: "lip balm",
  },

  {
    id: 6,
    name: "Acne Care Product",
    category: "Skin & Personal Care",
    description:
      "A generic skincare product formulated to support the management of everyday acne breakouts.",
    keywords: [
      "acne", "acne care", "pimples", "pimple", "breakout", "blackheads",
      "whiteheads", "oily skin", "spot treatment",
    ],
    type: "general-health-product",
    searchTerm: "acne care product",
  },

  {
    id: 7,
    name: "Gentle Body Wash",
    category: "Skin & Personal Care",
    description:
      "A mild body wash suitable for daily cleansing of normal to sensitive skin.",
    keywords: [
      "body wash", "shower gel", "sensitive skin", "dry skin", "skin care", "skincare", "bathing",
    ],
    type: "general-health-product",
    searchTerm: "gentle body wash",
  },

  {
    id: 8,
    name: "Hand Sanitizer",
    category: "Skin & Personal Care",
    description:
      "An alcohol-based hand sanitizer intended for general hand hygiene when soap and water are unavailable.",
    keywords: [
      "hand sanitizer", "sanitizer", "hand hygiene", "germs", "disinfect hands", "hygiene",
    ],
    type: "general-health-product",
    searchTerm: "hand sanitizer",
  },

  {
    id: 51,
    name: "Antifungal Foot Powder",
    category: "Skin & Personal Care",
    description:
      "A generic antifungal foot powder intended for everyday foot hygiene and comfort. Medicine use should follow the product label.",
    keywords: [
      "foot powder", "antifungal powder", "athlete's foot", "sweaty feet",
      "foot odor", "foot fungus", "foot care",
    ],
    type: "medicine",
    searchTerm: "antifungal foot powder",
  },

  {
    id: 52,
    name: "Prickly Heat Powder",
    category: "Skin & Personal Care",
    description:
      "A cooling talc-based powder intended to soothe prickly heat and general skin irritation in hot weather.",
    keywords: [
      "prickly heat", "heat rash", "cooling powder", "talcum powder",
      "sweat rash", "summer skin care",
    ],
    type: "general-health-product",
    searchTerm: "prickly heat powder",
  },

  {
    id: 53,
    name: "Insect Repellent Lotion",
    category: "Skin & Personal Care",
    description:
      "A topical lotion intended to help repel mosquitoes and other insects.",
    keywords: [
      "insect repellent", "mosquito repellent", "mosquito lotion", "bug spray",
      "outdoor protection", "mosquito bites",
    ],
    type: "general-health-product",
    searchTerm: "insect repellent lotion",
  },

  // =====================================================
  // COLD, COUGH & ALLERGY (10)
  // =====================================================

  {
    id: 9,
    name: "Saline Nasal Spray",
    category: "Cold, Cough & Allergy",
    description:
      "A saline nasal product commonly used for nasal moisture and cleansing.",
    keywords: [
      "nasal spray", "saline spray", "blocked nose", "stuffy nose", "runny nose",
      "nasal congestion", "congestion", "cold", "nose blockage", "nasal dryness",
    ],
    type: "general-health-product",
    searchTerm: "saline nasal spray",
  },

  {
    id: 10,
    name: "Steam Inhalation Device",
    category: "Cold, Cough & Allergy",
    description:
      "A device used for steam inhalation as part of general respiratory comfort.",
    keywords: [
      "steam", "steam inhaler", "inhalation", "cold", "blocked nose", "stuffy nose",
      "nasal congestion", "congestion", "respiratory comfort",
    ],
    type: "health-device",
    searchTerm: "steam inhaler device",
  },

  {
    id: 11,
    name: "Throat Lozenges",
    category: "Cold, Cough & Allergy",
    description:
      "Lozenges intended to soothe a sore or scratchy throat.",
    keywords: [
      "throat lozenges", "sore throat", "scratchy throat", "throat pain",
      "cough drops", "throat irritation",
    ],
    type: "general-health-product",
    searchTerm: "throat lozenges",
  },

  {
    id: 12,
    name: "Saline Nasal Rinse",
    category: "Cold, Cough & Allergy",
    description:
      "A saline rinse solution used to help clear nasal passages.",
    keywords: [
      "nasal rinse", "saline rinse", "sinus rinse", "blocked nose", "sinus congestion",
      "nasal congestion", "allergies", "sinus",
    ],
    type: "general-health-product",
    searchTerm: "saline nasal rinse",
  },

  {
    id: 13,
    name: "Cough Relief Product",
    category: "Cold, Cough & Allergy",
    description:
      "A generic cough-relief medicine. Medicine use should follow professional guidance and the product label.",
    keywords: [
      "cough", "cough syrup", "cough relief", "dry cough", "wet cough", "throat irritation",
    ],
    type: "medicine",
    searchTerm: "cough relief medicine",
  },

  {
    id: 14,
    name: "Allergy Relief Product",
    category: "Cold, Cough & Allergy",
    description:
      "A generic antihistamine-type medicine for allergy symptoms. Medicine use should follow professional guidance and the product label.",
    keywords: [
      "allergy", "allergies", "antihistamine", "sneezing", "itchy eyes", "runny nose", "hay fever",
    ],
    type: "medicine",
    searchTerm: "allergy relief medicine",
  },

  {
    id: 15,
    name: "Face Mask",
    category: "Cold, Cough & Allergy",
    description:
      "A protective face mask intended for general hygiene and respiratory protection.",
    keywords: [
      "face mask", "mask", "respiratory protection", "hygiene", "cold prevention", "allergy protection",
    ],
    type: "general-health-product",
    searchTerm: "face mask",
  },

  {
    id: 54,
    name: "Vapor Rub",
    category: "Cold, Cough & Allergy",
    description:
      "A topical vapor rub intended to provide a cooling, soothing sensation during colds and congestion.",
    keywords: [
      "vapor rub", "vaporub", "chest rub", "cold rub", "congestion relief",
      "blocked nose", "cold comfort",
    ],
    type: "general-health-product",
    searchTerm: "vapor rub",
  },

  {
    id: 55,
    name: "Cold & Flu Comfort Product",
    category: "Cold, Cough & Allergy",
    description:
      "A general product intended to provide everyday comfort during common cold and mild flu symptoms.",
    keywords: [
      "cold", "flu", "cold and flu", "body ache", "chills", "cold comfort", "mild fever",
    ],
    type: "general-health-product",
    searchTerm: "cold and flu comfort product",
  },

  {
    id: 56,
    name: "Room Humidifier",
    category: "Cold, Cough & Allergy",
    description:
      "A device intended to add moisture to indoor air, which can support general respiratory comfort.",
    keywords: [
      "humidifier", "room humidifier", "dry air", "respiratory comfort", "congestion",
      "dry throat", "indoor air",
    ],
    type: "health-device",
    searchTerm: "room humidifier",
  },

  // =====================================================
  // DIGESTIVE HEALTH (10)
  // =====================================================

  {
    id: 16,
    name: "Oral Rehydration Salts",
    category: "Digestive Health",
    description:
      "Oral rehydration solution products used to help replace fluids and electrolytes.",
    keywords: [
      "ors", "oral rehydration", "rehydration", "dehydration", "electrolytes",
      "loose motions", "loose motion", "diarrhea", "diarrhoea", "vomiting", "fluid replacement",
    ],
    type: "medicine",
    searchTerm: "oral rehydration salts",
  },

  {
    id: 17,
    name: "Digestive Health Support",
    category: "Digestive Health",
    description:
      "General digestive-health products intended for everyday wellness support.",
    keywords: [
      "digestion", "digestive", "digestive health", "bloating", "stomach",
      "gas", "indigestion", "stomach discomfort", "digestive wellness",
    ],
    type: "general-health-product",
    searchTerm: "digestive health support product",
  },

  {
    id: 18,
    name: "Antacid Product",
    category: "Digestive Health",
    description:
      "A generic antacid medicine intended to relieve acidity and heartburn. Medicine use should follow professional guidance and the product label.",
    keywords: [
      "antacid", "acidity", "heartburn", "acid reflux", "stomach acid", "indigestion",
    ],
    type: "medicine",
    searchTerm: "antacid medicine",
  },

  {
    id: 19,
    name: "Probiotic Product",
    category: "Digestive Health",
    description:
      "A probiotic supplement intended to support gut flora and general digestive wellness.",
    keywords: [
      "probiotic", "gut health", "gut flora", "digestive balance", "stomach health", "bloating",
    ],
    type: "supplement",
    searchTerm: "probiotic supplement",
  },

  {
    id: 20,
    name: "Fiber Supplement",
    category: "Digestive Health",
    description:
      "A dietary fiber supplement intended to support regular digestion.",
    keywords: [
      "fiber", "fibre", "fiber supplement", "constipation", "bowel movement", "digestive regularity",
    ],
    type: "supplement",
    searchTerm: "fiber supplement",
  },

  {
    id: 21,
    name: "Oral Rehydration Drink",
    category: "Digestive Health",
    description:
      "A ready-to-drink rehydration beverage used to help replace fluids and electrolytes.",
    keywords: [
      "rehydration drink", "electrolyte drink", "dehydration", "fluid replacement",
      "loose motions", "diarrhea", "diarrhoea", "hydration",
    ],
    type: "medicine",
    searchTerm: "oral rehydration drink",
  },

  {
    id: 22,
    name: "Digestive Enzyme Support Product",
    category: "Digestive Health",
    description:
      "A digestive enzyme supplement intended to support the breakdown of food after meals.",
    keywords: [
      "digestive enzymes", "enzyme supplement", "bloating", "indigestion", "heavy meals", "digestive support",
    ],
    type: "supplement",
    searchTerm: "digestive enzyme supplement",
  },

  {
    id: 57,
    name: "Mild Laxative",
    category: "Digestive Health",
    description:
      "A generic mild laxative medicine intended for occasional constipation relief. Medicine use should follow professional guidance and the product label.",
    keywords: [
      "laxative", "constipation", "bowel movement", "stool softener", "digestive relief",
    ],
    type: "medicine",
    searchTerm: "mild laxative medicine",
  },

  {
    id: 58,
    name: "Gripe Water",
    category: "Digestive Health",
    description:
      "A general infant-comfort product traditionally used for occasional colic and gas discomfort. Use should follow professional guidance for infants.",
    keywords: [
      "gripe water", "infant gas", "colic", "baby digestion", "baby gas relief",
    ],
    type: "general-health-product",
    searchTerm: "gripe water",
  },

  {
    id: 59,
    name: "Anti-Flatulence Product",
    category: "Digestive Health",
    description:
      "A general product intended to provide comfort from occasional gas and bloating.",
    keywords: [
      "gas relief", "flatulence", "bloating", "stomach gas", "digestive comfort",
    ],
    type: "general-health-product",
    searchTerm: "anti flatulence product",
  },

  // =====================================================
  // PAIN & FIRST AID (11)
  // =====================================================

  {
    id: 23,
    name: "Reusable Hot & Cold Pack",
    category: "Pain & First Aid",
    description:
      "A reusable hot and cold pack for general comfort and first-aid use.",
    keywords: [
      "ice pack", "cold pack", "hot pack", "heating pack", "heat pack", "pain",
      "pain relief", "swelling", "injury", "first aid", "muscle pain", "muscle soreness",
    ],
    type: "general-health-product",
    searchTerm: "reusable hot and cold pack",
  },

  {
    id: 24,
    name: "First Aid Kit",
    category: "Pain & First Aid",
    description:
      "A basic first-aid kit containing commonly used first-aid supplies.",
    keywords: [
      "first aid", "first aid kit", "bandage", "bandages", "wound care", "wound",
      "medical kit", "emergency kit", "cuts", "minor injuries",
    ],
    type: "general-health-product",
    searchTerm: "first aid kit",
  },

  {
    id: 25,
    name: "Paracetamol",
    category: "Pain & First Aid",
    description:
      "A generic medicine containing paracetamol. Medicine use should follow professional guidance and the product label.",
    keywords: [
      "paracetamol", "acetaminophen", "fever", "temperature", "pain", "pain relief",
      "headache", "body pain", "muscle pain", "mild pain",
    ],
    type: "medicine",
    searchTerm: "paracetamol",
  },

  {
    id: 26,
    name: "Adhesive Bandages",
    category: "Pain & First Aid",
    description:
      "Adhesive bandages intended to cover and protect minor cuts and wounds.",
    keywords: [
      "bandage", "bandages", "band aid", "band-aid", "cuts", "wound care", "minor injuries", "first aid",
    ],
    type: "general-health-product",
    searchTerm: "adhesive bandages",
  },

  {
    id: 27,
    name: "Sterile Gauze Pads",
    category: "Pain & First Aid",
    description:
      "Sterile gauze pads intended for cleaning and dressing minor wounds.",
    keywords: [
      "gauze", "gauze pads", "wound dressing", "wound care", "first aid", "cuts", "bleeding",
    ],
    type: "general-health-product",
    searchTerm: "sterile gauze pads",
  },

  {
    id: 28,
    name: "Antiseptic Wipes",
    category: "Pain & First Aid",
    description:
      "Antiseptic wipes intended for cleaning minor cuts, scrapes, and skin surfaces.",
    keywords: [
      "antiseptic wipes", "antiseptic", "wound cleaning", "disinfectant wipes", "cuts", "scrapes", "first aid",
    ],
    type: "general-health-product",
    searchTerm: "antiseptic wipes",
  },

  {
    id: 29,
    name: "Medical Tape",
    category: "Pain & First Aid",
    description:
      "Adhesive medical tape used to secure dressings and bandages in place.",
    keywords: [
      "medical tape", "surgical tape", "adhesive tape", "wound dressing", "bandage tape", "first aid",
    ],
    type: "general-health-product",
    searchTerm: "medical tape",
  },

  {
    id: 30,
    name: "Heating Pad / Hot Water Bag",
    category: "Pain & First Aid",
    description:
      "A heating pad or hot water bag used for general muscle and joint comfort.",
    keywords: [
      "heating pad", "hot water bag", "hot water bottle", "muscle pain", "joint pain",
      "back pain", "cramps", "warmth therapy",
    ],
    type: "general-health-product",
    searchTerm: "heating pad hot water bag",
  },

  {
    id: 60,
    name: "Crepe Bandage",
    category: "Pain & First Aid",
    description:
      "A stretchable crepe bandage intended for general support and wound dressing.",
    keywords: [
      "crepe bandage", "elastic bandage", "sprain support", "wound wrap", "first aid",
    ],
    type: "general-health-product",
    searchTerm: "crepe bandage",
  },

  {
    id: 61,
    name: "Burn Relief Gel",
    category: "Pain & First Aid",
    description:
      "A cooling gel intended to provide comfort for minor burns and skin irritation.",
    keywords: [
      "burn relief", "burn gel", "minor burns", "cooling gel", "skin burn", "first aid",
    ],
    type: "general-health-product",
    searchTerm: "burn relief gel",
  },

  {
    id: 62,
    name: "Muscle Relief Spray",
    category: "Pain & First Aid",
    description:
      "A topical spray intended to provide general comfort for muscle soreness and stiffness.",
    keywords: [
      "muscle spray", "muscle relief", "muscle pain", "sore muscles", "stiffness", "back pain",
    ],
    type: "general-health-product",
    searchTerm: "muscle relief spray",
  },

  // =====================================================
  // WOMEN'S HEALTH (10)
  // =====================================================

  {
    id: 31,
    name: "Sanitary Pads",
    category: "Women's Health",
    description:
      "Menstrual hygiene products available in different absorbency and size options.",
    keywords: [
      "periods", "period", "menstruation", "menstrual", "sanitary pad", "sanitary pads",
      "pads", "menstrual bleeding", "bleeding", "period hygiene", "monthly period",
      "monthly cycle", "women hygiene",
    ],
    type: "general-health-product",
    searchTerm: "sanitary pads",
  },

  {
    id: 32,
    name: "Menstrual Cup",
    category: "Women's Health",
    description:
      "A reusable menstrual hygiene product available in different sizes.",
    keywords: [
      "periods", "period", "menstruation", "menstrual", "menstrual cup", "period hygiene",
      "monthly period", "monthly cycle", "menstrual care", "women hygiene",
    ],
    type: "general-health-product",
    searchTerm: "menstrual cup",
  },

  {
    id: 33,
    name: "Tampons",
    category: "Women's Health",
    description:
      "Internal menstrual hygiene products available in different absorbencies.",
    keywords: [
      "periods", "period", "menstruation", "menstrual", "tampon", "tampons",
      "period hygiene", "monthly period", "monthly cycle", "menstrual care",
    ],
    type: "general-health-product",
    searchTerm: "tampons",
  },

  {
    id: 34,
    name: "Menstrual Care Products",
    category: "Women's Health",
    description:
      "Products intended to support menstrual hygiene, comfort, and personal care.",
    keywords: [
      "periods", "period", "period pain", "period cramps", "menstrual cramps", "cramps",
      "menstrual care", "menstrual hygiene", "menstruation", "menstrual", "monthly cycle", "women hygiene",
    ],
    type: "general-health-product",
    searchTerm: "menstrual care products",
  },

  {
    id: 35,
    name: "Intimate Hygiene Wipes",
    category: "Women's Health",
    description:
      "Personal hygiene wipes intended for external intimate-area cleansing.",
    keywords: [
      "intimate wipes", "intimate hygiene", "hygiene wipes", "feminine wipes",
      "personal hygiene", "women hygiene", "feminine hygiene", "intimate care",
    ],
    type: "general-health-product",
    searchTerm: "intimate hygiene wipes",
  },

  {
    id: 36,
    name: "Menstrual Heat Patch",
    category: "Women's Health",
    description:
      "A wearable heat patch intended to ease period cramp discomfort.",
    keywords: [
      "period cramps", "menstrual cramps", "cramps", "period pain", "heat patch", "period comfort",
    ],
    type: "general-health-product",
    searchTerm: "menstrual heat patch",
  },

  {
    id: 37,
    name: "Period Hygiene Product",
    category: "Women's Health",
    description:
      "General period-hygiene products intended for everyday menstrual comfort and cleanliness.",
    keywords: [
      "period hygiene", "menstrual hygiene", "periods", "period", "menstrual", "women hygiene",
    ],
    type: "general-health-product",
    searchTerm: "period hygiene product",
  },

  {
    id: 63,
    name: "Pregnancy Test Kit",
    category: "Women's Health",
    description:
      "A home pregnancy test kit intended for early detection. Results should be confirmed with a healthcare professional.",
    keywords: [
      "pregnancy test", "pregnancy kit", "home pregnancy test", "ovulation", "fertility test",
    ],
    type: "health-device",
    searchTerm: "pregnancy test kit",
  },

  {
    id: 64,
    name: "Postnatal Care Product",
    category: "Women's Health",
    description:
      "A general product intended to support everyday postnatal comfort and recovery care.",
    keywords: [
      "postnatal care", "postpartum care", "new mother care", "recovery care", "maternal wellness",
    ],
    type: "general-health-product",
    searchTerm: "postnatal care product",
  },

  {
    id: 65,
    name: "Women's Hormonal Wellness Supplement",
    category: "Women's Health",
    description:
      "A general wellness supplement intended to support everyday hormonal and cycle-related comfort.",
    keywords: [
      "hormonal balance", "pcos", "pcod", "cycle support", "women wellness", "supplement",
    ],
    type: "supplement",
    searchTerm: "women's hormonal wellness supplement",
  },

  // =====================================================
  // VITAMINS & SUPPLEMENTS (10)
  // =====================================================

  {
    id: 38,
    name: "Vitamin D Supplement",
    category: "Vitamins & Supplements",
    description:
      "A vitamin D supplement product. Supplement use should be discussed with a healthcare professional when appropriate.",
    keywords: [
      "vitamin d", "vitamin", "supplement", "vitamin d supplement", "nutrition", "nutrient", "vitamin deficiency",
    ],
    type: "supplement",
    searchTerm: "vitamin d supplement",
  },

  {
    id: 39,
    name: "Iron Supplement",
    category: "Vitamins & Supplements",
    description:
      "An iron supplement product. Appropriate use depends on individual nutritional needs and professional advice.",
    keywords: [
      "iron", "iron supplement", "supplement", "nutrition", "iron deficiency",
      "low iron", "nutrient", "anemia", "anaemia",
    ],
    type: "supplement",
    searchTerm: "iron supplement",
  },

  {
    id: 40,
    name: "Calcium Supplement",
    category: "Vitamins & Supplements",
    description:
      "A calcium supplement product intended to support bone health as part of general nutrition.",
    keywords: [
      "calcium", "calcium supplement", "bone health", "supplement", "nutrition", "nutrient",
    ],
    type: "supplement",
    searchTerm: "calcium supplement",
  },

  {
    id: 41,
    name: "Vitamin B12 Supplement",
    category: "Vitamins & Supplements",
    description:
      "A vitamin B12 supplement product intended to support general nutrition and energy metabolism.",
    keywords: [
      "vitamin b12", "b12", "vitamin b12 supplement", "fatigue", "supplement", "nutrition", "nutrient deficiency",
    ],
    type: "supplement",
    searchTerm: "vitamin b12 supplement",
  },

  {
    id: 42,
    name: "Multivitamin",
    category: "Vitamins & Supplements",
    description:
      "A multivitamin product intended to support general daily nutrition.",
    keywords: [
      "multivitamin", "vitamins", "daily vitamin", "supplement", "nutrition", "general wellness",
    ],
    type: "supplement",
    searchTerm: "multivitamin supplement",
  },

  {
    id: 43,
    name: "Vitamin C Supplement",
    category: "Vitamins & Supplements",
    description:
      "A vitamin C supplement product intended to support general immune and nutritional wellness.",
    keywords: [
      "vitamin c", "vitamin c supplement", "immunity", "immune support", "supplement", "nutrition",
    ],
    type: "supplement",
    searchTerm: "vitamin c supplement",
  },

  {
    id: 44,
    name: "Electrolyte Supplement",
    category: "Vitamins & Supplements",
    description:
      "An electrolyte supplement intended to support hydration during activity or heat.",
    keywords: [
      "electrolytes", "electrolyte supplement", "hydration", "dehydration", "sports drink", "fatigue",
    ],
    type: "supplement",
    searchTerm: "electrolyte supplement",
  },

  {
    id: 66,
    name: "Omega-3 Supplement",
    category: "Vitamins & Supplements",
    description:
      "An omega-3 fatty acid supplement intended to support general heart and wellness needs.",
    keywords: [
      "omega 3", "fish oil", "omega-3 supplement", "heart health", "nutrition", "supplement",
    ],
    type: "supplement",
    searchTerm: "omega 3 supplement",
  },

  {
    id: 67,
    name: "Zinc Supplement",
    category: "Vitamins & Supplements",
    description:
      "A zinc supplement product intended to support general immune wellness.",
    keywords: [
      "zinc", "zinc supplement", "immunity", "immune support", "nutrition", "supplement",
    ],
    type: "supplement",
    searchTerm: "zinc supplement",
  },

  {
    id: 68,
    name: "Magnesium Supplement",
    category: "Vitamins & Supplements",
    description:
      "A magnesium supplement product intended to support general muscle and nervous system wellness.",
    keywords: [
      "magnesium", "magnesium supplement", "muscle cramps", "sleep support", "nutrition", "supplement",
    ],
    type: "supplement",
    searchTerm: "magnesium supplement",
  },

  // =====================================================
  // HEALTH DEVICES (9)
  // =====================================================

  {
    id: 45,
    name: "Digital Thermometer",
    category: "Health Devices",
    description:
      "A digital device for measuring body temperature.",
    keywords: [
      "thermometer", "temperature", "fever", "digital thermometer", "body temperature", "temperature check",
    ],
    type: "health-device",
    searchTerm: "digital thermometer",
  },

  {
    id: 46,
    name: "Blood Pressure Monitor",
    category: "Health Devices",
    description:
      "A home blood-pressure monitoring device.",
    keywords: [
      "bp monitor", "blood pressure", "blood pressure monitor", "bp machine",
      "hypertension", "high blood pressure", "pressure monitor",
    ],
    type: "health-device",
    searchTerm: "blood pressure monitor",
  },

  {
    id: 47,
    name: "Pulse Oximeter",
    category: "Health Devices",
    description:
      "A device that measures blood oxygen saturation and pulse rate.",
    keywords: [
      "pulse oximeter", "oximeter", "oxygen", "spo2", "oxygen level", "blood oxygen",
      "pulse", "oxygen saturation",
    ],
    type: "health-device",
    searchTerm: "pulse oximeter",
  },

  {
    id: 48,
    name: "Blood Glucose Monitor",
    category: "Health Devices",
    description:
      "A home device used to measure blood glucose levels.",
    keywords: [
      "glucose monitor", "blood glucose", "blood sugar", "diabetes", "sugar test", "glucometer",
    ],
    type: "health-device",
    searchTerm: "blood glucose monitor",
  },

  {
    id: 49,
    name: "Digital Weighing Scale",
    category: "Health Devices",
    description:
      "A digital weighing scale intended for general body-weight tracking at home.",
    keywords: [
      "weighing scale", "weight scale", "digital scale", "body weight", "weight tracking",
    ],
    type: "health-device",
    searchTerm: "digital weighing scale",
  },

  {
    id: 50,
    name: "Nebulizer Device",
    category: "Health Devices",
    description:
      "A device used to deliver inhaled medication as part of respiratory care.",
    keywords: [
      "nebulizer", "nebuliser", "respiratory device", "breathing device", "inhalation therapy", "asthma device",
    ],
    type: "health-device",
    searchTerm: "nebulizer device",
  },

  {
    id: 69,
    name: "Non-Contact Infrared Thermometer",
    category: "Health Devices",
    description:
      "A non-contact infrared thermometer intended for quick, hygienic temperature checks.",
    keywords: [
      "infrared thermometer", "non contact thermometer", "forehead thermometer", "temperature check", "fever check",
    ],
    type: "health-device",
    searchTerm: "non contact infrared thermometer",
  },

  {
    id: 70,
    name: "Back Support Belt",
    category: "Health Devices",
    description:
      "A wearable support belt intended to provide general lower-back support and posture comfort.",
    keywords: [
      "back support", "back belt", "posture support", "lumbar support", "back pain", "posture corrector",
    ],
    type: "general-health-product",
    searchTerm: "back support belt",
  },

  {
    id: 71,
    name: "Nasal Aspirator",
    category: "Health Devices",
    description:
      "A device intended to help gently clear a baby's blocked nose.",
    keywords: [
      "nasal aspirator", "baby nose", "baby congestion", "infant care", "nose cleaner",
    ],
    type: "health-device",
    searchTerm: "nasal aspirator",
  },

];

export default products;