import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Footer() {
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

          <a href="#symptoms">Symptom Analyzer</a>
          <a href="#chatbot">AI Assistant</a>
          <a href="#specialists">Specialists</a>
          <a href="#pharmacy">Pharmacy</a>

        </div>


        <div className="footer-column">

          <h4>Resources</h4>

          <a href="#articles">Health Articles</a>
          <a href="#faq">FAQs</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>

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