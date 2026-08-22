import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

// The in-page views (Symptom Analyzer, Pharmacy, ...) are switched by
// callbacks from App. Routed pages (Contact, Articles, Specialists,
// Login) are navigated to directly, so the navbar behaves the same on
// every page that renders it - including /login.

function Navbar({
  openSymptomAnalyzer,
  openPharmacy,
  openReportAnalyzer,
  openAIAssistant,
  goHome,
  openContact,
  darkMode,
  toggleTheme,
}) {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, logout } = useAuth();

  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const servicesRef = useRef(null);
  const toggleRef = useRef(null);

  // Place the menu under the toggle. The menu is position: fixed, so
  // these are viewport coordinates.
  const openServices = () => {
    const rect = toggleRef.current?.getBoundingClientRect();

    if (rect) {
      setMenuPos({
        top: rect.bottom + 12,
        left: rect.left + rect.width / 2,
      });
    }

    setServicesOpen(true);
  };

  // -----------------------------------------------------
  // Close the Services menu on outside click / Escape
  // -----------------------------------------------------

  useEffect(() => {
    if (!servicesOpen) return;

    const onPointerDown = (event) => {
      if (!servicesRef.current?.contains(event.target)) {
        setServicesOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setServicesOpen(false);
    };

    // Fixed coordinates go stale once the page moves, so close rather
    // than leave the menu floating in the wrong place.
    const onReflow = () => setServicesOpen(false);

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onReflow, true);
    window.addEventListener("resize", onReflow);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onReflow, true);
      window.removeEventListener("resize", onReflow);
    };
  }, [servicesOpen]);

  // -----------------------------------------------------
  // Navigation helpers
  // -----------------------------------------------------

  const goToHome = () => {
    if (goHome) goHome();
    else navigate("/");
  };

  // Scroll to a section of the home page, returning home first if we are
  // on another route. The timeout lets React render Home before we look
  // the element up.
  const goToSection = (id) => {
    goToHome();

    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // Run a service callback when it was provided, otherwise fall back to
  // the home page so the link is never a dead end.
  const runService = (callback) => () => {
    setServicesOpen(false);

    if (callback) callback();
    else goToHome();
  };

  const services = [
    { label: "Symptom Analyzer", onClick: runService(openSymptomAnalyzer) },
    { label: "AI Assistant", onClick: runService(openAIAssistant) },
    { label: "Report Analyzer", onClick: runService(openReportAnalyzer) },
    {
      label: "Specialists",
      onClick: () => {
        setServicesOpen(false);
        navigate("/specialists");
      },
    },
    { label: "Pharmacy", onClick: runService(openPharmacy) },
  ];

  const handleLogout = async () => {
    await logout();
    goToHome();
  };

  return (
    <header className="navbar">

      <div className="nav-container">

        {/* LOGO */}

        <button
          className="logo"
          onClick={goToHome}
        >
          <span className="logo-mark">
            ♥
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
            onClick={goToHome}
          >
            Home
          </button>


          {/* SERVICES */}

          <div className="nav-dropdown" ref={servicesRef}>
            <button
              ref={toggleRef}
              className="nav-button nav-dropdown-toggle"
              onClick={() =>
                servicesOpen ? setServicesOpen(false) : openServices()
              }
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <ChevronDown
                size={14}
                className={
                  servicesOpen
                    ? "nav-chevron nav-chevron-open"
                    : "nav-chevron"
                }
              />
            </button>

            {servicesOpen && (
              <div
                className="nav-dropdown-menu"
                role="menu"
                style={{ top: menuPos.top, left: menuPos.left }}
              >
                {services.map((service) => (
                  <button
                    key={service.label}
                    className="nav-dropdown-item"
                    role="menuitem"
                    onClick={service.onClick}
                  >
                    {service.label}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* ARTICLES */}

          <button
            className="nav-button"
            onClick={() => navigate("/articles")}
          >
            Articles
          </button>


          {/* FAQS */}

          <button
            className="nav-button"
            onClick={() => goToSection("faqs")}
          >
            FAQs
          </button>


          {/* CONTACT US */}

          <button
            className="nav-button"
            onClick={() => (openContact ? openContact() : navigate("/contact"))}
          >
            Contact Us
          </button>

        </nav>


        <div className="nav-actions">

          {/* DARK MODE */}

          {toggleTheme && (
            <button
              className="theme-btn"
              onClick={toggleTheme}
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {darkMode ? "☀" : "☾"}
            </button>
          )}


          {/* ACCOUNT */}

          {loading ? (
            // Session is still being checked - render nothing rather
            // than flashing "Login" at someone who is signed in.
            null
          ) : isAuthenticated ? (
            <div className="nav-user">
              <span className="nav-user-name" title={user?.email}>
                <User size={14} />
                {user?.username}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;
