import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import SymptomAnalyzer from "./pages/SymptomAnalyzer";
import Pharmacy from "./pages/Pharmacy";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import AIHealthAssistant from "./pages/AIHealthAssistant";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [page, setPage] = useState("home");

  const [selectedSymptoms, setSelectedSymptoms] =
    useState([]);

  const navigate = useNavigate();

  // =====================================================
  // DARK MODE
  // =====================================================

  useEffect(() => {
    document.body.classList.toggle(
      "dark-theme",
      darkMode
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // =====================================================
  // NAVIGATION FUNCTIONS
  // =====================================================

  const goHome = () => {
    setPage("home");
    navigate("/");
  };

  const openSymptomAnalyzer = () => {
    setPage("symptom-analyzer");
    navigate("/");
  };

  const openReportAnalyzer = () => {
    setPage("report-analyzer");
    navigate("/");
  };

  const openAIAssistant = () => {
    setPage("ai-assistant");
    navigate("/");
  };

  const openPharmacy = (symptoms = []) => {
    setSelectedSymptoms(symptoms);
    setPage("pharmacy");
    navigate("/");
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const openLogin = () => {
    navigate("/login");
  };

  // =====================================================
  // CONTACT
  // =====================================================

  const openContact = () => {
    navigate("/contact");
  };

  // =====================================================
  // CURRENT MAIN APP PAGE
  // =====================================================

  const renderPage = () => {

    if (page === "home") {
      return (
        <Home
          openSymptomAnalyzer={openSymptomAnalyzer}
          openReportAnalyzer={openReportAnalyzer}
          openPharmacy={() => openPharmacy([])}
          openAIAssistant={openAIAssistant}
        />
      );
    }

    if (page === "symptom-analyzer") {
      return (
        <SymptomAnalyzer
          openPharmacy={openPharmacy}
          goHome={goHome}
        />
      );
    }

    if (page === "pharmacy") {
      return (
        <Pharmacy
          selectedSymptoms={selectedSymptoms}
          goHome={goHome}
        />
      );
    }

    if (page === "report-analyzer") {
      return (
        <ReportAnalyzer
          goHome={goHome}
        />
      );
    }

    if (page === "ai-assistant") {
      return (
        <AIHealthAssistant />
      );
    }

    return null;
  };

  // =====================================================
  // MAIN WEBSITE LAYOUT
  // =====================================================

  const MainWebsite = () => {
    return (
      <div className="app">

        <Navbar
          openSymptomAnalyzer={openSymptomAnalyzer}
          openPharmacy={() => openPharmacy([])}
          openReportAnalyzer={openReportAnalyzer}
          openAIAssistant={openAIAssistant}
          goHome={goHome}
          openLogin={openLogin}
          openContact={openContact}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />

        <main>
          {renderPage()}
        </main>

        <Footer />

      </div>
    );
  };

  // =====================================================
  // ROUTES
  // =====================================================

  return (
    <Routes>

      {/* MAIN SAFESURF WEBSITE */}
      <Route
        path="/"
        element={<MainWebsite />}
      />

      {/* LOGIN */}
      <Route
  path="/login"
  element={
    <Login
      openSymptomAnalyzer={openSymptomAnalyzer}
      openPharmacy={() => openPharmacy([])}
      openReportAnalyzer={openReportAnalyzer}
      openAIAssistant={openAIAssistant}
      goHome={goHome}
      openLogin={openLogin}
      openContact={openContact}
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  }
/>

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* CONTACT */}
      <Route
        path="/contact"
        element={<Contact />}
      />

    </Routes>
  );
}

export default App;