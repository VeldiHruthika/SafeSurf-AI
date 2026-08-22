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
import ModulePlaceholder from "./pages/ModulePlaceholder";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// =====================================================
// MAIN WEBSITE LAYOUT
// =====================================================
//
// Declared at module scope on purpose. Defining it inside App would
// create a new component type on every render, so React would unmount
// and remount the whole page - losing scroll position and any state
// inside the active view - every time the theme or page changed.

function MainWebsite({ navProps, children }) {
  return (
    <div className="app">

      <Navbar {...navProps} />

      <main>
        {children}
      </main>

      <Footer />

    </div>
  );
}

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
  // CONTACT
  // =====================================================

  const openContact = () => {
    navigate("/contact");
  };

  // =====================================================
  // SHARED NAVBAR PROPS
  //
  // Every page that renders a Navbar gets the same set, so the menu
  // behaves identically no matter which route you are on.
  // =====================================================

  const navProps = {
    openSymptomAnalyzer,
    openPharmacy: () => openPharmacy([]),
    openReportAnalyzer,
    openAIAssistant,
    goHome,
    openContact,
    darkMode,
    toggleTheme,
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
  // ROUTES
  // =====================================================

  return (
    <Routes>

      {/* MAIN SAFESURF WEBSITE */}
      <Route
        path="/"
        element={
          <MainWebsite navProps={navProps}>
            {renderPage()}
          </MainWebsite>
        }
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login {...navProps} />}
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

      {/* ARTICLES - Friend 3's module plugs in here */}
      <Route
        path="/articles"
        element={
          <ModulePlaceholder
            navProps={navProps}
            title="Health Articles"
            owner="the Pharmacy + Articles module"
            description="Health articles will be listed here, loaded from the database through the articles API."
          />
        }
      />

      {/* SPECIALISTS - Friend 2's module plugs in here */}
      <Route
        path="/specialists"
        element={
          <ModulePlaceholder
            navProps={navProps}
            title="Specialists & Appointments"
            owner="the Specialists + Appointments module"
            description="Specialist listings, doctor and hospital details, and appointment booking will live here."
          />
        }
      />

      {/* UNKNOWN ROUTE */}
      <Route
        path="*"
        element={
          <ModulePlaceholder
            navProps={navProps}
            title="Page not found"
            description="The page you were looking for does not exist."
          />
        }
      />

    </Routes>
  );
}

export default App;
