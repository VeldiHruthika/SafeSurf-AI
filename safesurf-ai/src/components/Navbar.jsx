import { HeartPulse } from "lucide-react";

function Navbar({
  openSymptomAnalyzer,
  openPharmacy,
  openReportAnalyzer,
  openAIAssistant,
  goHome,
  openLogin,
  darkMode,
  toggleTheme
}) {
  return (
    <header className="navbar">

      <div className="nav-container">

        {/* LOGO */}

        <button
          className="logo"
          onClick={goHome}
        >
          <span className="logo-mark">
            <HeartPulse size={18} strokeWidth={2.4} />
          </span>

          <span>
            SafeSurf AI
          </span>
        </button>


        {/* NAVIGATION */}

        <nav className="nav-links">

          {/* HOME */}

          <button
            className="nav-button"
            onClick={goHome}
          >
            Home
          </button>


          {/* SERVICES */}

          <a href="#services">
            Services
          </a>


          {/* SPECIALISTS */}

          <a href="#specialists">
            Specialists
          </a>


          {/* PHARMACY */}

          <button
            className="nav-button"
            onClick={openPharmacy}
          >
            Pharmacy
          </button>


          {/* REPORT ANALYZER */}

          <button
            className="nav-button"
            onClick={openReportAnalyzer}
          >
            Report Analyzer
          </button>


          {/* AI ASSISTANT */}

          <button
            className="nav-button"
            onClick={openAIAssistant}
          >
            AI Assistant
          </button>

        </nav>


        <div className="nav-actions">

          {/* DARK MODE */}

          {toggleTheme && (
            <button
              className="theme-btn"
              onClick={toggleTheme}
            >
              {darkMode ? "☀" : "☾"}
            </button>
          )}


          {/* LOGIN */}

          <button
            className="login-btn"
            onClick={openLogin}
          >
            Login
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;