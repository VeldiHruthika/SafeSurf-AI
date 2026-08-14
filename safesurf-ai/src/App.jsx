import { useEffect, useState } from "react";

import Home from "./pages/Home";
import SymptomAnalyzer from "./pages/SymptomAnalyzer";
import Pharmacy from "./pages/Pharmacy";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import AIHealthAssistant from "./pages/AIHealthAssistant";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  document.body.classList.toggle("dark-theme", darkMode);
}, [darkMode]);

const toggleTheme = () => {
  setDarkMode((prev) => !prev);
};
  const [page, setPage] = useState("home");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // =====================================================
  // NAVIGATION FUNCTIONS
  // =====================================================

  const goHome = () => {
    setPage("home");
  };

  const openSymptomAnalyzer = () => {
    setPage("symptom-analyzer");
  };

  const openReportAnalyzer = () => {
    setPage("report-analyzer");
  };
  const openAIAssistant = () => {
  setPage("ai-assistant");
};

  const openPharmacy = (symptoms = []) => {
    setSelectedSymptoms(symptoms);
    setPage("pharmacy");
  };

  // =====================================================
  // CURRENT PAGE
  // =====================================================

  const renderPage = () => {

    // ===================================================
    // HOME
    // ===================================================

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

    // ===================================================
    // SYMPTOM ANALYZER
    // ===================================================

    if (page === "symptom-analyzer") {
      return (
        <SymptomAnalyzer
          openPharmacy={openPharmacy}
          goHome={goHome}
        />
      );
    }

    // ===================================================
    // PHARMACY
    // ===================================================

    if (page === "pharmacy") {
      return (
        <Pharmacy
          selectedSymptoms={selectedSymptoms}
          goHome={goHome}
        />
      );
    }

    // ===================================================
    // REPORT ANALYZER
    // ===================================================

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
  // APP LAYOUT
  // =====================================================

  return (
    <div className="app">

      {/* =================================================
          GLOBAL NAVBAR
      ================================================= */}

      <Navbar
  openSymptomAnalyzer={openSymptomAnalyzer}
  openPharmacy={() => openPharmacy([])}
  openReportAnalyzer={openReportAnalyzer}
  openAIAssistant={openAIAssistant}
  goHome={goHome}
  darkMode={darkMode}
  toggleTheme={toggleTheme}
/>

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <main>
        {renderPage()}
      </main>

      {/* =================================================
          GLOBAL FOOTER
      ================================================= */}

      <Footer />

    </div>
  );
}

export default App;