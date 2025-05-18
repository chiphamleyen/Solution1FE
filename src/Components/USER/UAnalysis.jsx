import React, { useState } from "react";
import "../ADMIN/Common-Page.css";
import { FaPaperPlane } from "react-icons/fa";
import UNavigationBar from "./uNavigation/UNavigationBar";

const UAnalysis = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false); // Toggle for result display

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please upload a valid CSV or Excel file.");
    }
  };

  const handleAnalyseClick = () => {
    if (file || url.trim()) {
      setError("");
      setShowResults(true);
    } else {
      setError("Please upload a file or enter a URL before analysing.");
    }
  };

  const [url, setUrl] = useState("");

  // Styles
  const containerStyle = {
    backgroundColor: "#f6f9fc",
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const wrapperStyle = {
    width: "100%",
    maxWidth: "500px",
    padding: "2rem",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  const uploadBoxStyle = {
    width: "100%",
    minHeight: "150px",
    border: "2px dashed #ccc",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#aaa",
    fontSize: "1.2rem",
    position: "relative",
    cursor: "pointer",
    marginBottom: "1.5rem",
  };

  const inputStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
    top: 0,
    left: 0,
  };

  const buttonStyle = {
    backgroundColor: "#1a00ff",
    color: "white",
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    float: "right",
    marginTop: "1rem",
  };
  // ********************************************************************
  // ********************************************************************
  // ********************************************************************
  // *********************** SECTION BREAK ******************************
  // ********************************************************************
  // ********************************************************************
  // ********************************************************************

  return (
    <>
      <UNavigationBar />

      <div style={containerStyle}>
        <div style={wrapperStyle}>
          {!showResults ? (
            <>
              <div style={uploadBoxStyle}>
                <span>
                  +<br />
                  Upload or Drag File
                </span>
                <input
                  type="file"
                  accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                  style={inputStyle}
                />
              </div>
              {error && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>
              )}
              {file && (
                <p style={{ color: "green", fontSize: "0.9rem" }}>
                  File selected: {file.name}
                </p>
              )}

              <p style={{ margin: "1rem 0", fontWeight: "bold" }}>OR</p>

              <input
                type="text"
                placeholder="Paste URL to dataset..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                }}
              />

              <button onClick={handleAnalyseClick} style={buttonStyle}>
                Analyse <FaPaperPlane />
              </button>
            </>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  borderRadius: "10px 10px 0 0",
                  padding: "10px",
                }}
              >
                NetworkDataset.csv
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      MALWARE TYPE
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      DDoS
                    </td>
                  </tr>
                  {/* <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      SEVERITY LEVEL
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      HIGH
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      ACCURACY
                    </td>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>96%</td>
                  </tr> */}
                </tbody>
              </table>
              <p style={{ fontSize: "0.95rem", color: "#333" }}>
                Know more about this Malware Insight and Prevention?
              </p>
              <button
                style={{ ...buttonStyle, float: "none", marginTop: "1rem" }}
              >
                Save to History
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UAnalysis;
