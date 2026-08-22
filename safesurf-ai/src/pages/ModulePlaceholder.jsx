import { Link } from "react-router-dom";
import { ArrowLeft, Construction, HeartPulse } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/Login.css";

// Integration stub.
//
// The navbar routes to /articles and /specialists so the whole menu
// works today. These pages belong to other modules - drop the real
// component into the matching <Route> in App.jsx to replace this.

export default function ModulePlaceholder({
  title,
  owner,
  description,
  navProps = {},
}) {
  return (
    <>
      <Navbar {...navProps} />

      <main className="ss-auth">
        <Link to="/" className="ss-back">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="ss-card ss-auth-card">
          <div className="ss-icon">
            <Construction size={22} />
          </div>

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

          <h1 className="ss-title">{title}</h1>

          <p className="ss-hint">
            {description}

            {owner && (
              <>
                <br />
                <br />
                This module is being built by <strong>{owner}</strong>.
              </>
            )}
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
