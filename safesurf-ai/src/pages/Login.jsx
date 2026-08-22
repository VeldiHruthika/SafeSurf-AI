import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  HeartPulse,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/Login.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({
  openSymptomAnalyzer,
  openPharmacy,
  openReportAnalyzer,
  openAIAssistant,
  goHome,
  openLogin,
  openContact,
  darkMode,
  toggleTheme,
}) {
  const { sendLoginOtp, verifyLoginOtp } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const presetEmail = location.state?.email ?? "";

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // =====================================================
  // SEND LOGIN OTP
  // =====================================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");

    if (!EMAIL_RE.test(email)) {
      return setError("Enter a valid email address");
    }

    setBusy(true);

    const { ok, data } = await sendLoginOtp(
      email.trim().toLowerCase()
    );

    setBusy(false);

    if (ok && data.success) {
      setStep("otp");
    } else {
      setError(
        data.message ?? "Could not send login code."
      );
    }
  };

  // =====================================================
  // VERIFY LOGIN OTP
  // =====================================================

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");

    if (!/^[0-9]{6}$/.test(otp)) {
      return setError("Enter the 6-digit OTP");
    }

    setBusy(true);

    const { ok, data } = await verifyLoginOtp({
      email: email.trim().toLowerCase(),
      otp,
    });

    setBusy(false);

    if (ok && data.success) {
      navigate(
        location.state?.from ?? "/",
        { replace: true }
      );
    } else {
      setError(
        data.message ?? "OTP verification failed."
      );
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="login-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        openSymptomAnalyzer={openSymptomAnalyzer}
        openPharmacy={openPharmacy}
        openReportAnalyzer={openReportAnalyzer}
        openAIAssistant={openAIAssistant}
        goHome={goHome}
        openLogin={openLogin}
        openContact={openContact}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      {/* =================================================
          LOGIN CONTENT
      ================================================= */}

      <main className="ss-auth">

        

        {/* LOGIN CARD */}

        <div className="ss-card ss-auth-card">

          {/* ICON */}

          <div className="ss-icon">
            {step === "email" ? (
              <Lock size={22} />
            ) : (
              <KeyRound size={22} />
            )}
          </div>


          {/* BRAND */}

          <span className="ss-eyebrow">

            <HeartPulse
              size={12}
              style={{
                display: "inline",
                verticalAlign: "-1px",
                marginRight: 4,
              }}
            />

            SafeSurf AI

          </span>


          {/* TITLE */}

          <h1 className="ss-title">

            {step === "email"
              ? "Login to your account"
              : "Verify OTP"}

          </h1>


          {/* =================================================
              EMAIL STEP
          ================================================= */}

          {step === "email" && (

            <form
              onSubmit={handleSendOtp}
              noValidate
            >

              {/* ERROR */}

              {error && (
                <p
                  className="ss-error"
                  role="alert"
                >
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}


              {/* CREATE ACCOUNT HINT */}

              {error &&
                /no account/i.test(error) && (
                  <p className="ss-hint">

                    New here?{" "}

                    <Link to="/signup">
                      Create an account
                    </Link>

                  </p>
                )}


              {/* EMAIL */}

              <label className="ss-label">

                Email

                <span className="ss-input-wrap">

                  <Mail size={16} />

                  <input
                    className="ss-input"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoFocus
                    autoComplete="email"
                    placeholder="you@example.com"
                  />

                </span>

              </label>


              {/* SEND OTP BUTTON */}

              <button
                type="submit"
                className="ss-btn"
                disabled={busy}
              >

                {busy
                  ? "Sending…"
                  : "Send login code"}

              </button>

            </form>
          )}


          {/* =================================================
              OTP STEP
          ================================================= */}

          {step === "otp" && (

            <form
              onSubmit={handleVerify}
              noValidate
            >

              {/* OTP MESSAGE */}

              <p className="ss-hint">

                We emailed a 6-digit code to{" "}

                <strong>
                  {email}
                </strong>

                . It expires in 5 minutes.

              </p>


              {/* ERROR */}

              {error && (
                <p
                  className="ss-error"
                  role="alert"
                >
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}


              {/* OTP */}

              <label className="ss-label">

                OTP

                <input
                  className="ss-input ss-otp"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  autoFocus
                  placeholder="••••••"
                />

              </label>


              {/* VERIFY BUTTON */}

              <button
                type="submit"
                className="ss-btn"
                disabled={busy}
              >

                {busy
                  ? "Verifying…"
                  : "Verify & login"}

              </button>


              {/* CHANGE EMAIL */}

              <button
                type="button"
                className="ss-linkbtn"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                }}
              >
                ← Use a different email
              </button>

            </form>
          )}


          {/* =================================================
              SIGNUP LINK
          ================================================= */}

          <p className="ss-foot">

            No account yet?{" "}

            <Link to="/signup">
              Sign up
            </Link>

          </p>

        </div>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>
  );
}