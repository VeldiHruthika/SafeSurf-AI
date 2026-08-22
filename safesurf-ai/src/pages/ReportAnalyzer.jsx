import { useRef, useState } from "react";

import "../styles/report-analyzer.css";
import { API_BASE } from "../api";



function ReportAnalyzer() {

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [error, setError] =
    useState("");

  const [analysis, setAnalysis] =
    useState(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);


  // =====================================================
  // FILE SELECTION
  // =====================================================

  const handleFileChange = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setAnalysis(null);

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {

      setSelectedFile(null);

      setError(
        "Please upload a PDF, JPG, or PNG file."
      );

      return;
    }

    setSelectedFile(file);
  };


  // =====================================================
  // OPEN FILE PICKER
  // =====================================================

  const openFilePicker = () => {

    fileInputRef.current?.click();

  };


  // =====================================================
  // REMOVE FILE
  // =====================================================

  const removeFile = () => {

    setSelectedFile(null);
    setAnalysis(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };


  // =====================================================
  // ANALYZE REPORT
  // =====================================================

  const analyzeReport = async () => {

    if (!selectedFile) {
      return;
    }

    setError("");
    setAnalysis(null);
    setIsAnalyzing(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "report",
        selectedFile
      );


      const response =
        await fetch(
          `${API_BASE}/api/report-analyze`,
          {
            method: "POST",
            body: formData,
          }
        );


      const data =
        await response.json();


      console.log(
        "Report analysis response:",
        data
      );


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.error ||
          "Failed to analyze the report."
        );

      }


      if (!data.analysis) {

        throw new Error(
          "No analysis was returned by the server."
        );

      }


      setAnalysis(
        data.analysis
      );

    }

    catch (error) {

      console.error(
        "Report analysis error:",
        error
      );

      setError(
        error.message ||
        "Failed to analyze the report."
      );

    }

    finally {

      setIsAnalyzing(false);

    }

  };


  // =====================================================
  // ANALYZE ANOTHER REPORT
  // =====================================================

  const analyzeAnotherReport = () => {

    setSelectedFile(null);
    setAnalysis(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  return (
    <div className="report-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="report-header">

        <div className="report-header-content">

          


          <div className="report-badge">
            ✦ AI HEALTH TOOL
          </div>


          <h1>
            Understand Your
            <br />
            <span>
              Medical Report.
            </span>
          </h1>


          <p>
            Upload your medical report or prescription
            and let SafeSurf AI help you understand it.
          </p>

        </div>

      </section>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="report-wrapper">

        <div className="report-card">


          {/* =================================================
              CARD HEADER
          ================================================= */}

          {!analysis && (

            <div className="report-card-title">

              <div className="report-title-icon">
                📄
              </div>

              <div>

                <h2>
                  Understand Your Report
                </h2>

                <p>
                  Upload a blood test, medical report,
                  prescription, or healthcare document.
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              UPLOAD AREA
          ================================================= */}

          {!analysis && (

            <div
              className={
                selectedFile
                  ? "report-upload-box has-file"
                  : "report-upload-box"
              }
            >

              <div className="upload-icon">
                ↑
              </div>


              <h3>

                {selectedFile
                  ? "Report Selected"
                  : "Upload your report"}

              </h3>


              <p>

                {selectedFile
                  ? "Your file is ready for analysis."
                  : "Drag and drop your file here or choose a file from your device."}

              </p>


              <input
                ref={fileInputRef}
                type="file"
                accept="
                  .pdf,
                  .jpg,
                  .jpeg,
                  .png,
                  application/pdf,
                  image/jpeg,
                  image/png
                "
                onChange={handleFileChange}
                className="report-file-input"
              />


              {/* CHOOSE FILE */}

              {!selectedFile && (

                <button
                  type="button"
                  className="report-upload-btn"
                  onClick={openFilePicker}
                >
                  Choose File
                </button>

              )}


              {/* SELECTED FILE */}

              {selectedFile && (

                <div className="selected-file">

                  <div className="selected-file-icon">
                    📄
                  </div>


                  <div className="selected-file-info">

                    <strong>
                      {selectedFile.name}
                    </strong>

                    <span>
                      {(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </span>

                  </div>


                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={removeFile}
                  >
                    ×
                  </button>

                </div>

              )}


              {!selectedFile && (

                <span className="report-file-types">
                  PDF, JPG or PNG
                </span>

              )}

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="report-error">
              ⚠ {error}
            </div>

          )}


          {/* =================================================
              ANALYZE BUTTON
          ================================================= */}

          {!analysis && (

            <button
              type="button"
              className="report-analyze-btn"
              disabled={
                !selectedFile ||
                isAnalyzing
              }
              onClick={analyzeReport}
            >

              {isAnalyzing
                ? "✦ Analyzing Report..."
                : "✦ Analyze My Report"}

            </button>

          )}


          {/* =================================================
              ANALYSIS RESULT
          ================================================= */}

          {analysis && (

            <div className="report-results">


              {/* RESULT HEADER */}

              <div className="report-results-header">

                <span className="report-results-badge">
                  ✦ AI ANALYSIS COMPLETE
                </span>


                <h2>
                  Your Report Analysis
                </h2>


                <p>
                  Here is a simplified explanation
                  of the information found in your report.
                </p>

              </div>


              {/* SUMMARY */}

              {analysis.summary && (

                <div className="report-result-section">

                  <div className="report-result-section-title">

                    <span>
                      📋
                    </span>

                    <h3>
                      Summary
                    </h3>

                  </div>


                  <p className="report-result-text">
                    {analysis.summary}
                  </p>

                </div>

              )}


              {/* IMPORTANT VALUES */}

              {Array.isArray(
                analysis.important_values
              ) &&
              analysis.important_values.length > 0 && (

                <div className="report-result-section">

                  <div className="report-result-section-title">

                    <span>
                      🧪
                    </span>

                    <h3>
                      Important Values
                    </h3>

                  </div>


                  <div className="report-values-list">

                    {analysis.important_values.map(
                      (item, index) => {

                        const status =
                          item.status
                            ?.toLowerCase() || "";


                        let statusClass =
                          "normal";


                        if (
                          status.includes("high")
                        ) {
                          statusClass =
                            "high";
                        }

                        else if (
                          status.includes("low")
                        ) {
                          statusClass =
                            "low";
                        }


                        return (

                          <div
                            className="report-value-item"
                            key={`${item.name}-${index}`}
                          >

                            <div className="report-value-name">
                              {item.name}
                            </div>


                            <div className="report-value-result">
                              {item.result}
                            </div>


                            <div
                              className={`report-value-status ${statusClass}`}
                            >
                              {item.status}
                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>

              )}


              {/* EXPLANATION */}

              {analysis.explanation && (

                <div className="report-result-section">

                  <div className="report-result-section-title">

                    <span>
                      💡
                    </span>

                    <h3>
                      Easy Explanation
                    </h3>

                  </div>


                  <p className="report-result-text report-explanation">
                    {analysis.explanation}
                  </p>

                </div>

              )}


              {/* RECOMMENDATIONS */}

              {Array.isArray(
                analysis.recommendations
              ) &&
              analysis.recommendations.length > 0 && (

                <div className="report-result-section">

                  <div className="report-result-section-title">

                    <span>
                      🩺
                    </span>

                    <h3>
                      Recommendations
                    </h3>

                  </div>


                  <div className="report-recommendations">

                    {analysis.recommendations.map(
                      (recommendation, index) => (

                        <div
                          className="report-recommendation-item"
                          key={index}
                        >

                          <span>
                            ✓
                          </span>

                          <p>
                            {recommendation}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* DISCLAIMER */}

              <div className="report-analysis-disclaimer">

                <span>
                  ⚠
                </span>

                <p>
                  SafeSurf AI provides informational
                  explanations only. This analysis does
                  not diagnose medical conditions and
                  should not replace advice from a
                  qualified healthcare professional.
                </p>

              </div>


              {/* ANALYZE ANOTHER */}

              <button
                type="button"
                className="report-analyze-btn"
                onClick={analyzeAnotherReport}
              >
                ✦ Analyze Another Report
              </button>

            </div>

          )}


          {/* =================================================
              INFORMATION
          ================================================= */}

          {!analysis && (

            <div className="report-info-box">

              <div className="report-info-icon">
                ⚠
              </div>

              <div>

                <strong>
                  Important
                </strong>

                <p>
                  SafeSurf AI provides informational
                  explanations and does not replace
                  professional medical advice.
                </p>

              </div>

            </div>

          )}

        </div>

      </main>


    </div>
  );
}

export default ReportAnalyzer;