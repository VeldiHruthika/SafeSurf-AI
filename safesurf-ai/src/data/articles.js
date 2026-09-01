// =====================================================
// HEALTH ARTICLES — Disease & Condition Library
// Educational content only. Not medical advice.
// =====================================================

export const articles = [

  // =====================================================
  // COMMON CONDITIONS
  // =====================================================

  {
    id: 1,
    title: "Common Cold",
    category: "Common Condition",
    overview:
      "The common cold is a mild viral infection of the nose and throat, usually caused by rhinoviruses. It is one of the most frequent illnesses in both children and adults.",
    symptoms:
      "Runny or blocked nose, sneezing, sore throat, mild cough, low energy, and sometimes a mild headache or low-grade fever.",
    causes:
      "Caused by viruses spread through droplets in the air or contact with contaminated surfaces. Close contact with infected people and cold weather crowding indoors increase the risk.",
    warningSigns:
      "Seek medical advice if fever is high or lasts more than a few days, breathing becomes difficult, or symptoms worsen after initially improving, as this can suggest a secondary infection.",
    management:
      "Rest, fluids, and over-the-counter symptom relief are typically used. Most colds resolve on their own within seven to ten days without needing antibiotics.",
    outlook:
      "Recovery is usually complete within one to two weeks with no lasting effects, though people with weaker immune systems may take longer to recover.",
    source: "https://www.cdc.gov/common-cold/about/index.html",
  },

  {
    id: 2,
    title: "Seasonal Influenza",
    category: "Common Condition",
    overview:
      "Influenza (the flu) is a contagious respiratory illness caused by influenza viruses, generally more severe than the common cold.",
    symptoms:
      "Sudden fever, chills, muscle aches, fatigue, headache, dry cough, and sore throat, often coming on more abruptly than a cold.",
    causes:
      "Spread mainly through respiratory droplets when an infected person coughs, sneezes, or talks. Seasonal outbreaks are common in colder months.",
    warningSigns:
      "Difficulty breathing, persistent chest pain, confusion, or symptoms that improve then suddenly return with fever can indicate complications requiring urgent care.",
    management:
      "Rest, hydration, and antiviral medication if started early may be recommended by a healthcare provider, especially for higher-risk individuals.",
    outlook:
      "Most healthy people recover within one to two weeks, though the flu can lead to serious complications in young children, older adults, and those with chronic conditions.",
    source: "https://www.cdc.gov/flu/about/index.html",
  },

  {
    id: 3,
    title: "Migraine",
    category: "Common Condition",
    overview:
      "Migraine is a neurological condition causing recurrent, often intense headaches, frequently accompanied by other symptoms that affect daily functioning.",
    symptoms:
      "Throbbing pain usually on one side of the head, sensitivity to light and sound, nausea, and sometimes visual disturbances known as aura before the headache begins.",
    causes:
      "The exact cause isn't fully understood, but triggers can include stress, hormonal changes, certain foods, lack of sleep, and sensory stimuli.",
    warningSigns:
      "A sudden, severe headache unlike previous ones, headache with fever and stiff neck, or new neurological symptoms should be evaluated urgently.",
    management:
      "Pain-relief medication, identifying and avoiding personal triggers, adequate rest, and in some cases preventive medications prescribed by a doctor.",
    outlook:
      "Migraine is a chronic tendency for many people, but frequency and severity can often be reduced significantly with the right management plan.",
    source: "https://www.ninds.nih.gov/health-information/disorders/migraine",
  },

  {
    id: 4,
    title: "Iron-Deficiency Anemia",
    category: "Common Condition",
    overview:
      "Iron-deficiency anemia occurs when the body doesn't have enough iron to produce adequate hemoglobin, reducing the blood's ability to carry oxygen.",
    symptoms:
      "Fatigue, pale skin, weakness, shortness of breath, dizziness, and brittle nails.",
    causes:
      "Common causes include inadequate dietary iron, blood loss from heavy periods or gastrointestinal bleeding, and increased iron needs during pregnancy or growth.",
    warningSigns:
      "Chest pain, rapid heartbeat, fainting, or very heavy unexplained bleeding should prompt urgent medical evaluation.",
    management:
      "Iron supplementation, dietary changes to include iron-rich foods, and treating any underlying cause of blood loss, guided by a healthcare provider.",
    outlook:
      "With appropriate treatment, iron levels and symptoms generally improve within a few months, though the underlying cause should be identified to prevent recurrence.",
    source: "https://www.nhlbi.nih.gov/health/anemia/iron-deficiency-anemia",
  },

  {
    id: 29,
    title: "Urinary Tract Infection (UTI)",
    category: "Common Condition",
    overview:
      "A urinary tract infection develops when bacteria enter the bladder, urethra, or kidneys, most often traveling up from the skin or rectum. It's one of the most common bacterial infections, especially in women.",
    symptoms:
      "A burning feeling when urinating, a frequent or urgent need to urinate, cloudy or strong-smelling urine, and pelvic discomfort.",
    causes:
      "Most cases are caused by bacteria such as E. coli spreading into the urethra; risk increases with sexual activity, certain contraceptives, and structural changes in the urinary tract.",
    warningSigns:
      "Fever, chills, back or flank pain, nausea, or vomiting can signal the infection has reached the kidneys and needs prompt medical attention.",
    management:
      "Antibiotics prescribed by a healthcare provider, along with drinking plenty of fluids to help flush the urinary tract.",
    outlook:
      "Most UTIs clear up within a few days of starting antibiotics, though some people experience frequent recurrences that may need further evaluation.",
    source: "https://www.cdc.gov/uti/about/index.html",
  },

  {
    id: 30,
    title: "Viral Gastroenteritis (Stomach Flu)",
    category: "Common Condition",
    overview:
      "Viral gastroenteritis is an inflammation of the stomach and intestines caused by a virus, most commonly norovirus, leading to sudden vomiting and diarrhea.",
    symptoms:
      "Watery diarrhea, vomiting, stomach cramps, nausea, and sometimes a low-grade fever or body aches.",
    causes:
      "Spread through contact with an infected person, contaminated food or water, or touching contaminated surfaces and then touching the mouth.",
    warningSigns:
      "Signs of dehydration such as reduced urination, dizziness, extreme thirst, or a dry mouth call for prompt medical attention, especially in young children and older adults.",
    management:
      "Rest and staying hydrated with small, frequent sips of fluid; antibiotics aren't effective since the cause is viral.",
    outlook:
      "Most people recover within one to three days without lasting effects, though the virus can still spread for a few days after symptoms improve.",
    source: "https://www.cdc.gov/norovirus/about/index.html",
  },

  // =====================================================
  // CHRONIC CONDITIONS
  // =====================================================

  {
    id: 5,
    title: "Type 2 Diabetes",
    category: "Chronic Condition",
    overview:
      "Type 2 diabetes is a long-term metabolic condition in which the body becomes resistant to insulin or doesn't produce enough of it, leading to elevated blood sugar levels.",
    symptoms:
      "Increased thirst, frequent urination, fatigue, blurred vision, slow-healing wounds, and unexplained weight loss.",
    causes:
      "Risk factors include excess body weight, physical inactivity, family history, age, and certain ethnic backgrounds, though the exact combination of causes varies by individual.",
    warningSigns:
      "Very high or very low blood sugar symptoms such as confusion, rapid breathing, fruity-smelling breath, or loss of consciousness require emergency care.",
    management:
      "Blood sugar monitoring, dietary changes, regular physical activity, and medications or insulin as prescribed by a healthcare provider.",
    outlook:
      "With consistent management, many people live full, active lives, though long-term uncontrolled diabetes can increase the risk of heart, kidney, nerve, and eye complications.",
    source: "https://www.who.int/news-room/fact-sheets/detail/diabetes",
  },

  {
    id: 6,
    title: "Hypertension (High Blood Pressure)",
    category: "Chronic Condition",
    overview:
      "Hypertension is a common condition in which the long-term force of blood against artery walls is high enough to eventually cause health problems.",
    symptoms:
      "Often has no noticeable symptoms, which is why it's sometimes called a 'silent' condition; some people may experience headaches or nosebleeds in severe cases.",
    causes:
      "Contributing factors include genetics, high salt intake, physical inactivity, excess weight, stress, and excessive alcohol consumption.",
    warningSigns:
      "Severely elevated blood pressure with symptoms like severe headache, chest pain, vision problems, or difficulty breathing needs emergency attention.",
    management:
      "Lifestyle changes such as reduced salt intake, regular exercise, and weight management, along with medication when prescribed by a doctor.",
    outlook:
      "Well-controlled blood pressure significantly reduces the risk of heart disease, stroke, and kidney problems over the long term.",
    source: "https://www.who.int/news-room/fact-sheets/detail/hypertension",
  },

  {
    id: 7,
    title: "Asthma",
    category: "Chronic Condition",
    overview:
      "Asthma is a chronic condition affecting the airways, causing them to become inflamed and narrowed, making breathing difficult at times.",
    symptoms:
      "Wheezing, shortness of breath, chest tightness, and coughing, particularly at night or during physical activity.",
    causes:
      "A combination of genetic and environmental factors, with symptoms often triggered by allergens, pollution, cold air, exercise, or respiratory infections.",
    warningSigns:
      "Severe difficulty breathing, bluish lips or face, or a rescue inhaler not providing relief are signs of a medical emergency.",
    management:
      "Avoiding known triggers, using prescribed inhalers, and following an asthma action plan developed with a healthcare provider.",
    outlook:
      "Asthma cannot be cured but can usually be well controlled, allowing most people to lead active lives with few limitations.",
    source: "https://www.who.int/news-room/fact-sheets/detail/asthma",
  },

  {
    id: 8,
    title: "Chronic Kidney Disease",
    category: "Chronic Condition",
    overview:
      "Chronic kidney disease is the gradual loss of kidney function over time, often linked to underlying conditions like diabetes or high blood pressure.",
    symptoms:
      "Early stages often have no symptoms; later stages may include fatigue, swelling in the legs, changes in urination, and nausea.",
    causes:
      "Commonly caused by long-standing diabetes or hypertension, but can also result from kidney infections, inherited conditions, or prolonged use of certain medications.",
    warningSigns:
      "Severe swelling, very low urine output, confusion, or shortness of breath can indicate advanced kidney problems requiring urgent care.",
    management:
      "Managing underlying conditions, dietary adjustments, blood pressure control, and regular monitoring by a healthcare provider; advanced cases may need dialysis.",
    outlook:
      "Early detection and management can slow progression significantly, though advanced chronic kidney disease is a serious, life-altering condition.",
    source: "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd",
  },

  {
    id: 31,
    title: "Osteoarthritis",
    category: "Chronic Condition",
    overview:
      "Osteoarthritis is the most common form of arthritis, occurring when the cartilage cushioning the joints gradually breaks down, causing the bones to rub together.",
    symptoms:
      "Joint pain and stiffness, especially after rest or first thing in the morning, swelling, reduced range of motion, and a grinding sensation during movement.",
    causes:
      "Risk increases with age, previous joint injury, repetitive joint stress, excess body weight, and genetic factors affecting joint structure.",
    warningSigns:
      "Sudden, severe joint swelling, redness, and warmth, or an inability to bear weight, should be evaluated to rule out other causes such as infection.",
    management:
      "Weight management, low-impact exercise, physical therapy, pain-relief medication, and in advanced cases joint injections or surgery.",
    outlook:
      "Osteoarthritis tends to progress gradually over years; most people manage symptoms well with a combination of lifestyle changes and medical care.",
    source: "https://www.niams.nih.gov/health-topics/osteoarthritis",
  },

  {
    id: 32,
    title: "Epilepsy",
    category: "Chronic Condition",
    overview:
      "Epilepsy is a brain disorder marked by a tendency toward recurring, unprovoked seizures caused by bursts of abnormal electrical activity in the brain.",
    symptoms:
      "Seizures can look very different depending on type, ranging from brief staring spells and confusion to convulsions with loss of consciousness and muscle jerking.",
    causes:
      "Causes include brain injury, stroke, infections affecting the brain, developmental conditions, or genetic factors; in many cases, no clear cause is found.",
    warningSigns:
      "A seizure lasting longer than five minutes, repeated seizures without regaining consciousness, or difficulty breathing afterward is a medical emergency.",
    management:
      "Anti-seizure medication guided by a neurologist, identifying and avoiding personal seizure triggers, and in some cases dietary therapy or surgery.",
    outlook:
      "Many people with epilepsy achieve good seizure control with treatment and lead full, active lives, though some cases remain more difficult to manage.",
    source: "https://www.cdc.gov/epilepsy/about/index.html",
  },

  // =====================================================
  // INFECTIOUS DISEASES
  // =====================================================

  {
    id: 9,
    title: "Dengue Fever",
    category: "Infectious Disease",
    overview:
      "Dengue is a mosquito-borne viral infection common in tropical and subtropical regions, transmitted primarily by Aedes mosquitoes.",
    symptoms:
      "High fever, severe headache, pain behind the eyes, joint and muscle pain, rash, and mild bleeding such as nosebleeds or gum bleeding.",
    causes:
      "Caused by the dengue virus, spread through the bite of infected Aedes mosquitoes, which typically bite during the day.",
    warningSigns:
      "Severe abdominal pain, persistent vomiting, bleeding from the gums or nose, and difficulty breathing can signal severe dengue, a medical emergency.",
    management:
      "There is no specific antiviral treatment; care focuses on fluid intake, fever and pain management, and close monitoring for warning signs.",
    outlook:
      "Most people recover fully within one to two weeks, but severe dengue requires prompt hospital care and can be life-threatening if untreated.",
    source: "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue",
  },

  {
    id: 10,
    title: "Tuberculosis",
    category: "Infectious Disease",
    overview:
      "Tuberculosis is a bacterial infection that most commonly affects the lungs and spreads through the air when an infected person coughs or sneezes.",
    symptoms:
      "Persistent cough lasting more than three weeks, coughing up blood, chest pain, fatigue, weight loss, and night sweats.",
    causes:
      "Caused by Mycobacterium tuberculosis bacteria, spread person to person through airborne droplets, with prolonged close contact increasing risk.",
    warningSigns:
      "Coughing up significant amounts of blood or severe difficulty breathing requires immediate medical attention.",
    management:
      "A structured, several-month course of antibiotics prescribed and supervised by a healthcare provider, completed fully to prevent drug resistance.",
    outlook:
      "With complete treatment, tuberculosis is curable in the large majority of cases, though incomplete treatment can lead to drug-resistant forms.",
    source: "https://www.who.int/news-room/fact-sheets/detail/tuberculosis",
  },

  {
    id: 11,
    title: "Viral Hepatitis (Hepatitis A & B)",
    category: "Infectious Disease",
    overview:
      "Viral hepatitis refers to inflammation of the liver caused by different hepatitis viruses, with hepatitis A typically spread through contaminated food or water and hepatitis B through blood and body fluids.",
    symptoms:
      "Fatigue, nausea, abdominal discomfort, dark urine, and jaundice (yellowing of the skin or eyes).",
    causes:
      "Hepatitis A spreads through contaminated food and water; hepatitis B spreads through infected blood, unprotected sex, or from mother to child during birth.",
    warningSigns:
      "Severe abdominal pain, confusion, or intense jaundice can indicate serious liver involvement requiring urgent evaluation.",
    management:
      "Hepatitis A usually resolves with supportive care and rest; hepatitis B may require antiviral medication and long-term monitoring for chronic infection.",
    outlook:
      "Hepatitis A typically resolves fully; hepatitis B can become chronic in some cases, so vaccination and early diagnosis are important for prevention.",
    source: "https://www.who.int/news-room/fact-sheets/detail/hepatitis-b",
  },

  {
    id: 33,
    title: "COVID-19",
    category: "Infectious Disease",
    overview:
      "COVID-19 is a contagious respiratory illness caused by the SARS-CoV-2 virus, which spreads mainly through respiratory droplets and can affect people differently depending on their health.",
    symptoms:
      "Fever or chills, cough, sore throat, fatigue, muscle aches, headache, congestion, and sometimes loss of taste or smell.",
    causes:
      "Caused by infection with SARS-CoV-2, spread when an infected person breathes, talks, coughs, or sneezes near others.",
    warningSigns:
      "Trouble breathing, persistent chest pain or pressure, new confusion, or bluish lips or face require emergency medical care.",
    management:
      "Rest, fluids, and symptom relief for mild cases; antiviral treatment may be recommended for people at higher risk of severe illness.",
    outlook:
      "Most people recover within one to two weeks, though older adults and those with underlying health conditions face a higher risk of severe illness or lingering symptoms.",
    source: "https://www.cdc.gov/covid/about/index.html",
  },

  {
    id: 34,
    title: "HIV (Human Immunodeficiency Virus)",
    category: "Infectious Disease",
    overview:
      "HIV is a virus that attacks the body's immune system, specifically cells that help fight infection, and can lead to AIDS if left untreated.",
    symptoms:
      "Early infection may cause flu-like symptoms such as fever, fatigue, and swollen glands; many people have no symptoms for years afterward while the virus is still active.",
    causes:
      "Spread through contact with certain body fluids, most often during sex without a condom or by sharing needles; it is not spread through casual contact.",
    warningSigns:
      "Rapid weight loss, persistent fevers or night sweats, prolonged swollen lymph nodes, or recurring infections should prompt HIV testing and medical evaluation.",
    management:
      "Antiretroviral therapy taken consistently as prescribed, which can reduce the virus to undetectable levels and prevent transmission to others.",
    outlook:
      "With early diagnosis and consistent treatment, people with HIV can live long, healthy lives; untreated HIV can progress to AIDS over time.",
    source: "https://www.cdc.gov/hiv/about/index.html",
  },

  // =====================================================
  // SERIOUS CONDITIONS
  // =====================================================

  {
    id: 12,
    title: "Stroke",
    category: "Serious Condition",
    overview:
      "A stroke occurs when blood supply to part of the brain is interrupted or reduced, depriving brain tissue of oxygen and nutrients.",
    symptoms:
      "Sudden numbness or weakness especially on one side of the body, confusion, trouble speaking, vision problems, and difficulty walking or loss of balance.",
    causes:
      "Caused by a blocked artery (ischemic stroke) or a burst blood vessel (hemorrhagic stroke), with risk increased by high blood pressure, smoking, and heart conditions.",
    warningSigns:
      "Sudden facial drooping, arm weakness, or speech difficulty are classic emergency warning signs — stroke requires immediate emergency care, as timing significantly affects outcomes.",
    management:
      "Emergency treatment depends on stroke type and timing, followed by rehabilitation therapy to help regain lost function.",
    outlook:
      "Outcomes vary widely depending on how quickly treatment begins and stroke severity; many people require ongoing rehabilitation and long-term risk-factor management.",
    source: "https://www.stroke.org/en/about-stroke",
  },

  {
    id: 13,
    title: "Coronary Artery Disease",
    category: "Serious Condition",
    overview:
      "Coronary artery disease develops when the blood vessels supplying the heart become narrowed or blocked, usually due to a buildup of fatty deposits.",
    symptoms:
      "Chest pain or discomfort, shortness of breath, fatigue, and in some cases pain radiating to the arm, jaw, or back.",
    causes:
      "Risk factors include high cholesterol, high blood pressure, smoking, diabetes, obesity, and a family history of heart disease.",
    warningSigns:
      "Sudden, severe chest pain, pain spreading to the arm or jaw, sweating, and shortness of breath can indicate a heart attack and require emergency care.",
    management:
      "Lifestyle changes, cholesterol and blood pressure management, medications, and in some cases procedures to restore blood flow to the heart.",
    outlook:
      "With appropriate management, many people reduce their risk of heart attack significantly, though it remains a leading cause of serious cardiac events globally.",
    source: "https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)",
  },

  {
    id: 14,
    title: "Chronic Obstructive Pulmonary Disease (COPD)",
    category: "Serious Condition",
    overview:
      "COPD is a progressive lung disease that makes breathing increasingly difficult, most often caused by long-term exposure to irritating gases or particles.",
    symptoms:
      "Chronic cough, mucus production, shortness of breath especially during activity, wheezing, and chest tightness.",
    causes:
      "Long-term smoking is the leading cause; prolonged exposure to air pollution, dust, or chemical fumes can also contribute.",
    warningSigns:
      "Severe shortness of breath at rest, bluish lips, or confusion suggests a serious flare-up requiring emergency care.",
    management:
      "Smoking cessation, inhaled medications, pulmonary rehabilitation, and oxygen therapy in advanced cases, guided by a healthcare provider.",
    outlook:
      "COPD is a progressive condition without a cure, but appropriate management can slow progression and meaningfully improve quality of life.",
    source: "https://www.who.int/news-room/fact-sheets/detail/chronic-obstructive-pulmonary-disease-(copd)",
  },

  // =====================================================
  // MENTAL HEALTH
  // =====================================================

  {
    id: 15,
    title: "Generalized Anxiety Disorder",
    category: "Mental Health",
    overview:
      "Generalized anxiety disorder involves persistent, excessive worry about everyday situations that is difficult to control and interferes with daily life.",
    symptoms:
      "Restlessness, fatigue, difficulty concentrating, muscle tension, irritability, and sleep disturbances alongside ongoing worry.",
    causes:
      "A combination of genetic, environmental, and psychological factors, including stressful life events and brain chemistry differences.",
    warningSigns:
      "Thoughts of self-harm, panic that prevents daily functioning, or physical symptoms like chest pain should be discussed with a professional promptly.",
    management:
      "Talk therapy such as cognitive behavioral therapy, stress-management techniques, and medication when recommended by a mental health professional.",
    outlook:
      "With appropriate support and treatment, most people experience significant improvement in symptoms and daily functioning over time.",
    source: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
  },

  {
    id: 16,
    title: "Major Depressive Disorder",
    category: "Mental Health",
    overview:
      "Major depressive disorder is a mood condition causing persistent feelings of sadness, hopelessness, and loss of interest in activities once enjoyed.",
    symptoms:
      "Low mood most of the day, fatigue, changes in appetite or sleep, difficulty concentrating, feelings of worthlessness, and loss of interest in usual activities.",
    causes:
      "Involves a mix of genetic predisposition, brain chemistry, life circumstances, and stressful or traumatic events.",
    warningSigns:
      "Thoughts of self-harm or suicide are a mental health emergency — reaching out to a crisis line or trusted person immediately is important.",
    management:
      "Psychotherapy, lifestyle support, and medication when appropriate, guided by a mental health professional over time.",
    outlook:
      "Depression is highly treatable for most people, and many experience substantial improvement with consistent, appropriate care.",
    source: "https://www.nimh.nih.gov/health/topics/depression",
  },

  {
    id: 35,
    title: "Bipolar Disorder",
    category: "Mental Health",
    overview:
      "Bipolar disorder is a mental health condition causing unusual shifts in mood, energy, and activity levels, ranging from emotional highs (mania or hypomania) to depressive lows.",
    symptoms:
      "During manic episodes: elevated mood, racing thoughts, decreased need for sleep, and impulsive behavior. During depressive episodes: low mood, fatigue, and loss of interest, similar to major depression.",
    causes:
      "Involves a combination of genetic, brain chemistry, and environmental factors; it often runs in families and typically emerges in the late teens or early adulthood.",
    warningSigns:
      "Thoughts of self-harm or suicide, or behavior during a manic episode that puts someone at serious risk, are a mental health emergency requiring immediate support.",
    management:
      "Mood-stabilizing medication, psychotherapy, and consistent routines around sleep and stress, guided by a mental health professional over the long term.",
    outlook:
      "Bipolar disorder is a lifelong condition, but with ongoing treatment many people achieve long stretches of stability and lead full, productive lives.",
    source: "https://www.nimh.nih.gov/health/topics/bipolar-disorder",
  },

  {
    id: 36,
    title: "Post-Traumatic Stress Disorder (PTSD)",
    category: "Mental Health",
    overview:
      "PTSD can develop after experiencing or witnessing a frightening or life-threatening event, causing the brain's stress response to remain activated long after the danger has passed.",
    symptoms:
      "Intrusive memories or flashbacks, nightmares, avoidance of trauma reminders, feeling constantly on edge, and emotional numbness or detachment.",
    causes:
      "Can follow events such as accidents, violence, combat, natural disasters, or abuse; not everyone who experiences trauma develops PTSD.",
    warningSigns:
      "Thoughts of self-harm or suicide, or symptoms that make daily functioning impossible, warrant reaching out to a crisis line or mental health professional right away.",
    management:
      "Trauma-focused psychotherapy such as cognitive processing therapy, and medication when appropriate, guided by a mental health professional.",
    outlook:
      "Many people see substantial improvement with treatment, though the course varies — some recover within months while others need longer-term support.",
    source: "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd",
  },

  // =====================================================
  // WOMEN'S HEALTH — HORMONAL CONDITIONS
  // =====================================================

  {
    id: 17,
    title: "Polycystic Ovary Syndrome (PCOS)",
    category: "Hormonal Conditions",
    overview:
      "PCOS is a common hormonal condition affecting people with ovaries, involving irregular periods, elevated androgen levels, and often small cysts on the ovaries.",
    symptoms:
      "Irregular or absent periods, excess facial or body hair, acne, weight gain, and difficulty with fertility.",
    causes:
      "The exact cause isn't fully known, but insulin resistance, genetics, and hormonal imbalances are believed to play a central role.",
    warningSigns:
      "Severe pelvic pain or very heavy, prolonged bleeding should be evaluated by a healthcare provider promptly.",
    management:
      "Lifestyle changes, hormonal medications to regulate cycles, and treatments targeted at specific symptoms like acne or fertility concerns.",
    outlook:
      "PCOS is a long-term condition, but symptoms can generally be well managed, and many people with PCOS successfully conceive with appropriate care.",
    source: "https://www.womenshealth.gov/a-z-topics/polycystic-ovary-syndrome",
  },

  {
    id: 18,
    title: "Hypothyroidism",
    category: "Hormonal Conditions",
    overview:
      "Hypothyroidism occurs when the thyroid gland doesn't produce enough thyroid hormone, slowing down many of the body's functions.",
    symptoms:
      "Fatigue, weight gain, cold sensitivity, dry skin, hair thinning, and irregular menstrual cycles.",
    causes:
      "Commonly caused by autoimmune thyroid disease, though it can also result from certain medications, prior thyroid surgery, or iodine deficiency.",
    warningSigns:
      "Extreme fatigue, confusion, or very slow heart rate can indicate a rare but serious complication requiring urgent care.",
    management:
      "Daily thyroid hormone replacement medication prescribed and monitored by a healthcare provider.",
    outlook:
      "With consistent treatment and monitoring, most people manage hypothyroidism well and lead normal, active lives.",
    source: "https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism",
  },

  // =====================================================
  // WOMEN'S HEALTH — MENSTRUAL CONDITIONS
  // =====================================================

  {
    id: 19,
    title: "Dysmenorrhea (Painful Periods)",
    category: "Menstrual Conditions",
    overview:
      "Dysmenorrhea refers to painful menstrual cramps that occur before or during a period, ranging from mild to severe.",
    symptoms:
      "Throbbing or cramping pain in the lower abdomen, sometimes radiating to the lower back or thighs, along with nausea or fatigue.",
    causes:
      "Primary dysmenorrhea is linked to natural uterine contractions; secondary dysmenorrhea can result from underlying conditions like endometriosis or fibroids.",
    warningSigns:
      "Pain that is severe enough to prevent daily activities, worsens over time, or is accompanied by heavy bleeding warrants medical evaluation.",
    management:
      "Pain relief medication, heat therapy, regular exercise, and treating any underlying cause identified by a healthcare provider.",
    outlook:
      "Most cases are manageable with self-care, though persistent or worsening pain should be assessed to rule out an underlying condition.",
    source: "https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods",
  },

  {
    id: 20,
    title: "Heavy Menstrual Bleeding (Menorrhagia)",
    category: "Menstrual Conditions",
    overview:
      "Menorrhagia refers to abnormally heavy or prolonged menstrual bleeding that can interfere with daily activities.",
    symptoms:
      "Soaking through pads or tampons frequently, bleeding lasting more than seven days, and passing large blood clots.",
    causes:
      "Can result from hormonal imbalances, uterine fibroids, polyps, certain medications, or underlying bleeding disorders.",
    warningSigns:
      "Signs of significant blood loss such as dizziness, rapid heartbeat, or extreme fatigue should be evaluated promptly.",
    management:
      "Depending on the cause, treatment may include hormonal therapy, medication to reduce bleeding, or procedures recommended by a gynecologist.",
    outlook:
      "Most causes of heavy bleeding are treatable once identified, significantly improving symptoms and quality of life.",
    source: "https://www.acog.org/womens-health/faqs/heavy-menstrual-bleeding",
  },

  // =====================================================
  // WOMEN'S HEALTH — REPRODUCTIVE CONDITIONS
  // =====================================================

  {
    id: 21,
    title: "Endometriosis",
    category: "Reproductive Conditions",
    overview:
      "Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus, often causing pain and, in some cases, fertility challenges.",
    symptoms:
      "Chronic pelvic pain, especially during periods, pain during intercourse, heavy periods, and fatigue.",
    causes:
      "The exact cause is unknown, though theories include retrograde menstruation, immune system factors, and genetic predisposition.",
    warningSigns:
      "Severe, worsening pelvic pain or pain that significantly disrupts daily life should be evaluated by a healthcare provider.",
    management:
      "Pain management, hormonal therapy, and in some cases surgery, tailored to symptom severity and fertility goals.",
    outlook:
      "Endometriosis is a chronic condition, but many people find significant symptom relief with appropriate long-term management.",
    source: "https://www.womenshealth.gov/a-z-topics/endometriosis",
  },

  {
    id: 22,
    title: "Uterine Fibroids",
    category: "Reproductive Conditions",
    overview:
      "Uterine fibroids are non-cancerous growths that develop in or around the uterus, varying widely in size and number.",
    symptoms:
      "Heavy or prolonged periods, pelvic pressure or pain, frequent urination, and in some cases fertility difficulties.",
    causes:
      "The exact cause is unclear, but hormonal factors, genetics, and family history are believed to contribute to their development.",
    warningSigns:
      "Sudden severe pelvic pain or very heavy bleeding causing significant blood loss should be evaluated urgently.",
    management:
      "Treatment ranges from monitoring for small, symptom-free fibroids to medication or surgical options for larger or symptomatic ones.",
    outlook:
      "Many fibroids remain small and manageable; treatment decisions typically depend on symptom severity and personal fertility plans.",
    source: "https://www.womenshealth.gov/a-z-topics/uterine-fibroids",
  },

  {
    id: 37,
    title: "Infertility",
    category: "Reproductive Conditions",
    overview:
      "Infertility is generally defined as not becoming pregnant after a year of regular, unprotected sex (or six months for those over 35), and can involve either partner.",
    symptoms:
      "The main sign is difficulty conceiving; irregular or absent periods can be a sign of an underlying ovulation problem in some cases.",
    causes:
      "Common causes include ovulation disorders like PCOS, blocked fallopian tubes, uterine conditions such as fibroids or endometriosis, age-related decline in egg quality, and male factors affecting sperm.",
    warningSigns:
      "Severe pelvic pain, very irregular or absent periods, or known conditions like endometriosis should prompt earlier evaluation rather than waiting the full year.",
    management:
      "Evaluation by a fertility specialist to identify the cause, followed by options such as medication, surgery, or assisted reproductive technologies like IUI or IVF.",
    outlook:
      "Many people affected by infertility go on to conceive with treatment or, in some cases, without it; outcomes depend heavily on the underlying cause and age.",
    source: "https://www.womenshealth.gov/a-z-topics/infertility",
  },

  // =====================================================
  // WOMEN'S HEALTH — GYNECOLOGICAL CONDITIONS
  // =====================================================

  {
    id: 23,
    title: "Pelvic Inflammatory Disease (PID)",
    category: "Gynecological Conditions",
    overview:
      "Pelvic inflammatory disease is an infection of the female reproductive organs, often resulting from untreated sexually transmitted infections.",
    symptoms:
      "Lower abdominal pain, unusual vaginal discharge, pain during intercourse, and irregular bleeding.",
    causes:
      "Most commonly caused by bacteria that spread from the vagina or cervix, frequently linked to untreated chlamydia or gonorrhea.",
    warningSigns:
      "High fever, severe abdominal pain, or feeling very unwell should prompt urgent medical evaluation to prevent complications.",
    management:
      "A course of antibiotics prescribed by a healthcare provider, along with treatment of any sexual partners to prevent reinfection.",
    outlook:
      "With prompt treatment, most people recover fully, though delayed treatment can increase the risk of long-term fertility complications.",
    source: "https://www.cdc.gov/std/pid/stdfact-pid.htm",
  },

  {
    id: 24,
    title: "Vaginal Yeast Infection",
    category: "Gynecological Conditions",
    overview:
      "A vaginal yeast infection is a common fungal infection causing irritation, discharge, and itching of the vaginal area.",
    symptoms:
      "Itching, burning, thick white discharge, and redness or swelling around the vaginal area.",
    causes:
      "Usually caused by an overgrowth of naturally occurring Candida fungus, triggered by antibiotic use, hormonal changes, or a weakened immune system.",
    warningSigns:
      "Symptoms that don't improve with standard treatment or that recur frequently should be evaluated to rule out other causes.",
    management:
      "Antifungal treatments, available over the counter or by prescription, usually resolve symptoms within a few days to a week.",
    outlook:
      "Most yeast infections clear up quickly and completely with appropriate antifungal treatment.",
    source: "https://www.womenshealth.gov/a-z-topics/vaginal-yeast-infections",
  },

  // =====================================================
  // WOMEN'S HEALTH — MENOPAUSE & MIDLIFE HEALTH
  // =====================================================

  {
    id: 25,
    title: "Menopause",
    category: "Menopause & Midlife Health",
    overview:
      "Menopause marks the natural end of menstrual cycles, typically occurring in a person's late 40s to early 50s, as reproductive hormone levels decline.",
    symptoms:
      "Hot flashes, night sweats, mood changes, sleep difficulties, vaginal dryness, and irregular periods leading up to the final one.",
    causes:
      "A natural biological process caused by declining estrogen and progesterone production as ovarian function decreases with age.",
    warningSigns:
      "Bleeding after menopause has been confirmed (twelve months without a period) should always be evaluated by a healthcare provider.",
    management:
      "Lifestyle adjustments, symptom-targeted treatments, and hormone therapy when appropriate, discussed individually with a healthcare provider.",
    outlook:
      "Menopause is a natural transition; most symptoms ease over time, and many long-term health considerations can be addressed with proactive care.",
    source: "https://www.womenshealth.gov/menopause",
  },

  {
    id: 26,
    title: "Osteoporosis",
    category: "Menopause & Midlife Health",
    overview:
      "Osteoporosis is a condition in which bones become weak and brittle, increasing the risk of fractures, and is more common after menopause.",
    symptoms:
      "Often has no symptoms until a fracture occurs; some people may notice loss of height or a stooped posture over time.",
    causes:
      "Declining estrogen levels after menopause, low calcium or vitamin D intake, inactivity, and genetics all contribute to bone density loss.",
    warningSigns:
      "A fracture from a minor fall or bump, or sudden back pain, should be evaluated promptly, as it may indicate significant bone weakening.",
    management:
      "Adequate calcium and vitamin D, weight-bearing exercise, and medications to strengthen bone density when prescribed by a healthcare provider.",
    outlook:
      "With early detection and consistent management, fracture risk can be substantially reduced, supporting continued mobility and independence.",
    source: "https://www.niams.nih.gov/health-topics/osteoporosis",
  },

  // =====================================================
  // RARE & ULTRA-RARE
  // =====================================================

  {
    id: 27,
    title: "Ehlers-Danlos Syndrome",
    category: "Rare & Ultra-Rare",
    overview:
      "Ehlers-Danlos syndrome refers to a group of rare inherited connective tissue disorders affecting skin, joints, and blood vessel walls.",
    symptoms:
      "Overly flexible joints, stretchy or fragile skin, easy bruising, and in some types, complications affecting blood vessels.",
    causes:
      "Caused by genetic mutations affecting collagen production, inherited in different patterns depending on the specific subtype.",
    warningSigns:
      "Sudden severe pain, especially abdominal or chest pain in the vascular subtype, requires immediate emergency evaluation.",
    management:
      "Supportive care including physical therapy, joint protection strategies, and monitoring by specialists depending on the subtype involved.",
    outlook:
      "Severity varies widely by subtype; many people manage symptoms well with supportive care, though vascular forms require closer long-term monitoring.",
    source: "https://rarediseases.org/rare-diseases/ehlers-danlos-syndrome/",
  },

  {
    id: 28,
    title: "Primary Ovarian Insufficiency",
    category: "Rare & Ultra-Rare",
    overview:
      "Primary ovarian insufficiency occurs when the ovaries stop functioning normally before age 40, leading to reduced hormone production and fertility challenges.",
    symptoms:
      "Irregular or absent periods, hot flashes, night sweats, vaginal dryness, and difficulty conceiving.",
    causes:
      "Causes can include genetic factors, autoimmune conditions, certain medical treatments like chemotherapy, or may remain unknown in many cases.",
    warningSigns:
      "Absence of periods for several months in someone under 40 should be evaluated by a healthcare provider.",
    management:
      "Hormone therapy to manage symptoms and protect long-term bone and heart health, along with fertility counseling if desired.",
    outlook:
      "While the condition is generally permanent, symptoms are manageable, and some people with the condition do still conceive naturally or with fertility support.",
    source: "https://rarediseases.org/rare-diseases/primary-ovarian-insufficiency/",
  },

  {
    id: 38,
    title: "Cystic Fibrosis",
    category: "Rare & Ultra-Rare",
    overview:
      "Cystic fibrosis is an inherited disorder that causes the body to produce unusually thick, sticky mucus, primarily affecting the lungs and digestive system.",
    symptoms:
      "Persistent cough with thick mucus, frequent lung infections, poor growth despite a good appetite, greasy stools, and salty-tasting skin.",
    causes:
      "Caused by mutations in the CFTR gene inherited from both parents, which disrupts the normal movement of salt and water in and out of cells.",
    warningSigns:
      "A sudden worsening of breathing difficulty, coughing up blood, or severe abdominal pain requires prompt evaluation by a CF care team.",
    management:
      "Airway clearance techniques, medications that target the underlying CFTR defect, pancreatic enzyme supplements, and regular care from a specialized CF team.",
    outlook:
      "Newer CFTR-targeted therapies have significantly improved life expectancy and quality of life, though cystic fibrosis remains a lifelong condition requiring ongoing care.",
    source: "https://rarediseases.org/rare-diseases/cystic-fibrosis/",
  },

  {
    id: 39,
    title: "Marfan Syndrome",
    category: "Rare & Ultra-Rare",
    overview:
      "Marfan syndrome is a genetic disorder affecting the body's connective tissue, which can influence the heart, blood vessels, bones, joints, and eyes.",
    symptoms:
      "Unusually tall, slender build with long limbs and fingers, flexible joints, a curved spine, and vision problems such as a dislocated lens.",
    causes:
      "Caused by mutations in the FBN1 gene, usually inherited from a parent in an autosomal dominant pattern, though it can also occur spontaneously.",
    warningSigns:
      "Sudden chest or back pain can signal a tear in the aorta (aortic dissection), a life-threatening emergency requiring immediate care.",
    management:
      "Regular monitoring of the heart and aorta, medications to reduce strain on blood vessels, activity guidance to avoid high-intensity strain, and surgery when needed to repair the aorta.",
    outlook:
      "With regular cardiovascular monitoring and timely treatment, most people with Marfan syndrome now have a near-normal life expectancy.",
    source: "https://rarediseases.org/rare-diseases/marfan-syndrome/",
  },

];

export default articles;