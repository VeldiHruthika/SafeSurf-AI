import { useState } from "react";
function Home({
  openSymptomAnalyzer,
  openPharmacy,
  openAIAssistant,
  openBodyScope,
  openPersonalizedCarePlanner,
  openArticles
}) {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <main>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <div className="hero-badge">
            ✦ AI-POWERED HEALTHCARE
          </div>

          <h1>
            Your health.
            <br />
            <span>Smarter.</span>
          </h1>

          <p>
            Understand your symptoms, discover the right
            specialists, explore healthcare services and get
            intelligent assistance — all in one place.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={openSymptomAnalyzer}
            >
              Analyze Symptoms →
            </button>

            <button
  className="secondary-btn"
  onClick={openAIAssistant}
>
  Talk to AI
</button>

          </div>

          <div className="hero-features">

            <span>
              ✓ AI assisted
            </span>

            <span>
              ✓ Simple & secure
            </span>

            <span>
              ✓ Healthcare focused
            </span>

          </div>

        </div>


        <div className="hero-visual">

          <div className="hero-glow"></div>

          <div className="health-card">

            <div className="health-icon">
              ♥
            </div>

            <h3>
              Healthcare,
              <br />
              made simpler.
            </h3>

            <p>
              From symptoms to support.
            </p>

            <div className="mini-stats">

              <div>
                <strong>AI</strong>
                <span>Assistant</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Access</span>
              </div>

              <div>
                <strong>360°</strong>
                <span>Support</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          SERVICES
      ================================================= */}

      <section
        className="quick-section"
        id="services"
      >

        <div className="section-heading">

          <span>
            QUICK ACCESS
          </span>

          <h2>
            Everything you need,
            <br />
            in one place.
          </h2>

        </div>


        <div className="service-grid">

          {/* =================================================
              SYMPTOM ANALYZER
          ================================================= */}

          <button
            className="service-card"
            onClick={openSymptomAnalyzer}
          >

            <div className="service-icon">
              ⌁
            </div>

            <h3>
              Symptom Analyzer
            </h3>

            <p>
              Analyze your symptoms and understand
              possible health conditions.
            </p>

          </button>
          {/* =================================================
    BODYSCOPE AI
================================================= */}

<button
  className="service-card"
  onClick={openBodyScope}
>
  <div className="service-icon">
    🫀
  </div>

  <h3>
    BodyScope AI
  </h3>

  <p>
    Explore an interactive body map, select any body area,
    and describe what you're experiencing.
  </p>
</button>


          {/* =================================================
              AI ASSISTANT
          ================================================= */}

          <button
  className="service-card"
  onClick={openAIAssistant}
>

  <div className="service-icon">
    ✦
  </div>

  <h3>
    Talk to AI
  </h3>

  <p>
    Ask health-related questions and receive
    intelligent general healthcare guidance.
  </p>

</button>
{/* =================================================
    PERSONALIZED CARE PLANNER
================================================= */}

<button
  className="service-card"
  onClick={openPersonalizedCarePlanner}
>

  <div className="service-icon">
    🩺
  </div>

  <h3>
    Personalized Care Planner
  </h3>

  <p>
    Build your health profile, analyze medical reports,
    and receive personalized lifestyle and healthcare guidance.
  </p>

</button>
{/* =================================================
    ARTICLES
================================================= */}

<button
  className="service-card"
  onClick={openArticles}
>

  <div className="service-icon">
    📖
  </div>

  <h3>
    Health Articles
  </h3>

  <p>
    Browse easy-to-understand articles on common
    conditions, symptoms, and management tips.
  </p>

</button>
          {/* =================================================
              SPECIALISTS
          ================================================= */}

          <div
  className="service-card"
  id="specialists"
>

  <div className="service-icon">
    👨‍⚕️
  </div>

  <h3>
    Specialists & Appointments
  </h3>

  <p>
    Find doctors, view specialist information,
    and book appointments.
  </p>

</div>


          {/* =================================================
              PHARMACY
          ================================================= */}

          <button
            className="service-card"
            onClick={openPharmacy}
          >

            <div className="service-icon">
              +
            </div>

            <h3>
              Online Pharmacy
            </h3>

            <p>
              Browse healthcare products through
              trusted external pharmacy platforms.
            </p>

          </button>

        </div>

      </section>


      {/* =================================================
          ABOUT
      ================================================= */}

      <section className="about-section">

        <div className="about-box">

          <span>
            ABOUT SAFESURF AI
          </span>

          <h2>
            Healthcare shouldn't
            <br />
            feel complicated.
          </h2>

          <p>
  SafeSurf AI brings symptom analysis,
  medical report understanding,
  AI-powered healthcare guidance,
  specialists, pharmacy services
  and health information together
  in one convenient platform.
</p>

        </div>

      </section>
      {/* =================================================
    FAQ
================================================= */}

<section
  className="faq-section"
  id="faqs"
>

  <div className="faq-container">

    <div className="faq-intro">

      <span className="faq-label">
        FAQ
      </span>

      <h2>
        Questions,
        <br />
        answered clearly.
      </h2>

      <p>
        Find answers to common questions about
        SafeSurf AI, its healthcare tools and
        how the platform works.
      </p>

    </div>


    <div className="faq-list">

      {[
        {
          question: "Can SafeSurf AI diagnose my health condition?",
          answer:
            "No. SafeSurf AI offers AI-assisted insights based on the symptoms, body areas or reports you provide. It is not a medical diagnosis and should not replace evaluation by a qualified doctor."
        },

        {
          question: "How personalized are the insights and recommendations?",
          answer:
            "The Personalized Care Planner builds on the health profile, symptoms and reports you share to tailor lifestyle and healthcare guidance to your situation. The more detail you provide, the more relevant the guidance — though it remains general guidance, not a medical plan."
        },

        {
          question: "When should I seek immediate medical attention instead of using AI?",
          answer:
            "If you experience symptoms such as severe chest pain, difficulty breathing, sudden collapse or loss of consciousness, contact emergency services or go to the nearest hospital right away rather than relying on SafeSurf AI's tools."
        },

        {
          question: "Is my health information and uploaded report data private?",
          answer:
            "SafeSurf AI is built with user privacy in mind. Uploaded reports and health details are used only to generate your results and recommendations. Avoid entering personal or highly sensitive information beyond what a feature actually needs."
        },

        {
          question: "Can SafeSurf AI help me understand which specialist to consult?",
          answer:
            "Yes. Based on your symptoms or analysis results, SafeSurf AI can point you toward the type of specialist that may be relevant, and the Specialists & Appointments section lets you find doctors and book a visit from there."
        },

        {
          question: "Does SafeSurf AI replace a doctor?",
          answer:
            "No. SafeSurf AI is a healthcare support and information platform. It should not be used as a substitute for professional medical advice, diagnosis or treatment."
        }
      ].map((faq, index) => (

        <div
          className={`faq-item ${
            openFAQ === index ? "active" : ""
          }`}
          key={index}
        >

          <button
            type="button"
            className="faq-question"
            onClick={() =>
              setOpenFAQ(
                openFAQ === index ? null : index
              )
            }
            aria-expanded={openFAQ === index}
          >

            <span>
              {faq.question}
            </span>

            <span className="faq-icon">
              {openFAQ === index ? "−" : "+"}
            </span>

          </button>


          <div
            className="faq-answer"
          >
            <div>
              {faq.answer}
            </div>
          </div>

        </div>

      ))}

    </div>

  </div>

</section>


      {/* =================================================
          CHATBOT
      ================================================= */}

      <section
        className="cta-section"
        id="chatbot"
      >

        <div>

          <span>
            NEED SOME GUIDANCE?
          </span>

          <h2>
            Have a health question?
          </h2>

          <p>
            Talk to our AI health assistant and get
            general healthcare information anytime.
          </p>

          <button
  className="primary-btn"
  onClick={openAIAssistant}
>
  Talk to AI →
</button>

        </div>

      </section>

    </main>
  );
}

export default Home;