import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import SymptomAnalyzer from "./pages/SymptomAnalyzer";
import Pharmacy from "./pages/Pharmacy";
import Articles from "./pages/Articles";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import AIHealthAssistant from "./pages/AIHealthAssistant";
import BodyScopeAI from "./pages/BodyScopeAI";
import PersonalizedCarePlanner from "./pages/PersonalizedCarePlanner";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {

  // =====================================================
  // STATES
  // =====================================================

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


  // =====================================================
  // BODYSCOPE AI
  // =====================================================

  const openBodyScope = () => {

    setPage("body-scope");

    navigate("/");

  };
  const openPersonalizedCarePlanner = () => {

  setPage("personalized-care-planner");

  navigate("/");

};


  const openPharmacy = (symptoms = []) => {
    setSelectedSymptoms(symptoms);
    setPage("pharmacy");
    navigate("/");
  };
  const openArticles = () => {
  setPage("articles");
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


    // HOME

    if (page === "home") {

      return (

        <Home
  openSymptomAnalyzer={
    openSymptomAnalyzer
  }

  openPharmacy={() =>
    openPharmacy([])
  }

  openAIAssistant={
    openAIAssistant
  }

  openBodyScope={
    openBodyScope
  }

  openPersonalizedCarePlanner={
    openPersonalizedCarePlanner
  }

  openArticles={
    openArticles
  }
/>

      );

    }


    // SYMPTOM ANALYZER

    if (page === "symptom-analyzer") {

      return (

        <SymptomAnalyzer
          openPharmacy={openPharmacy}
          goHome={goHome}
        />

      );

    }


    // PHARMACY

    if (page === "pharmacy") {
      return (
        <Pharmacy
          selectedSymptoms={selectedSymptoms}
          goHome={goHome}
        />
      );
    }
    if (page === "articles") {
  return <Articles />;
}


    // REPORT ANALYZER

    if (page === "report-analyzer") {

      return (

        <ReportAnalyzer
          goHome={goHome}
        />

      );

    }


    // AI ASSISTANT

    if (page === "ai-assistant") {

      return (

        <AIHealthAssistant />

      );

    }


    // =====================================================
    // BODYSCOPE AI
    // =====================================================

    if (page === "body-scope") {

      return (

        <BodyScopeAI
          goHome={goHome}
        />

      );

    }
    // PERSONALIZED CARE PLANNER

if (page === "personalized-care-planner") {

  return (

    <PersonalizedCarePlanner
      goHome={goHome}
    />

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

          <div className="app">


            {/* NAVBAR */}

            <Navbar

              openSymptomAnalyzer={
                openSymptomAnalyzer
              }

              openPharmacy={() =>
                openPharmacy([])
              }
              openArticles={openArticles}

              openReportAnalyzer={
                openReportAnalyzer
              }

              openAIAssistant={
                openAIAssistant
              }

              goHome={goHome}

              openLogin={openLogin}

              openContact={openContact}

              darkMode={darkMode}

              toggleTheme={toggleTheme}

            />


            {/* MAIN CONTENT */}

            <main>

              {renderPage()}

            </main>


            {/* FOOTER */}

            <Footer />


          </div>

        }
      />


      {/* LOGIN */}

      <Route
        path="/login"

        element={

          <Login

            openSymptomAnalyzer={
              openSymptomAnalyzer
            }

            openPharmacy={() =>
              openPharmacy([])
            }

            openReportAnalyzer={
              openReportAnalyzer
            }

            openAIAssistant={
              openAIAssistant
            }

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
        element={
          <Signup />
        }
      />


      {/* CONTACT */}

      <Route
        path="/contact"
        element={
          <Contact />
        }
      />


    </Routes>

  );

}


export default App;