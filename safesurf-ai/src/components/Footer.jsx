import { useNavigate } from "react-router-dom";

import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// Every link here used to be a bare "#anchor". Six of the eight pointed
// at ids that do not exist on the page, so they silently did nothing.
// They now run the same navigation callbacks the Navbar uses, which
// keeps the two menus in step.

function Footer({
  openSymptomAnalyzer,
  openPharmacy,
  openAIAssistant,
  goHome,
  openContact,
}) {
  const navigate = useNavigate();

  // Sections live on the home page, so return there first and let the
  // route settle before scrolling.
  const goToSection = (id) => {
    if (goHome) goHome();
    else navigate("/");

    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // Fall back to the home page when a callback was not supplied, so a
  // link is never a dead end.
  const run = (callback) => () => {
    if (callback) callback();
    else navigate("/");
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <div className="footer-logo">
            <div className="logo-icon">
              <HeartPulse size={20} />
            </div>

            <div className="logo-text">
              <span>SafeSurf</span>
              <small>AI</small>
            </div>
          </div>

          <p>
            Smarter healthcare assistance,
            designed to help you navigate your health journey safely.
          </p>

        </div>


        <div className="footer-column">

          <h4>Platform</h4>

          <button
            className="footer-link"
            onClick={run(openSymptomAnalyzer)}
          >
            Symptom Analyzer
          </button>

          <button
            className="footer-link"
            onClick={run(openAIAssistant)}
          >
            AI Assistant
          </button>

          <button
            className="footer-link"
            onClick={() => goToSection("specialists")}
          >
            Specialists
          </button>

          <button
            className="footer-link"
            onClick={run(openPharmacy)}
          >
            Pharmacy
          </button>

        </div>


        <div className="footer-column">

          <h4>Resources</h4>

          <button
            className="footer-link"
            onClick={() => navigate("/articles")}
          >
            Health Articles
          </button>

          <button
            className="footer-link"
            onClick={() => goToSection("faqs")}
          >
            FAQs
          </button>

          <button
            className="footer-link"
            onClick={() => goToSection("about")}
          >
            About Us
          </button>

          <button
            className="footer-link"
            onClick={run(openContact)}
          >
            Contact
          </button>

        </div>


        <div className="footer-column">

          <h4>Contact</h4>

          <div className="footer-contact">
            <Phone size={16} />
            <span>+91 90000 00000</span>
          </div>

          <div className="footer-contact">
            <Mail size={16} />
            <span>support@safesurf.ai</span>
          </div>

          <div className="footer-contact">
            <MapPin size={16} />
            <span>Warangal, Telangana</span>
          </div>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © 2026 SafeSurf AI. All rights reserved.
        </span>

        <span>
          Built with care.
        </span>

      </div>

    </footer>
  );
}

export default Footer;
