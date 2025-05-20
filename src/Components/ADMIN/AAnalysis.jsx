import React, { useState } from "react";
import "./Common-Page.css";
import { FaPaperPlane } from "react-icons/fa";
import ANavigationBar from "./ANavigation/ANavigationBar";


const AAnalysis = () => {

  const token = localStorage.getItem("admin_token");
  if (!token) {
    window.location.href = "/";
    return null;
  }

  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

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

  const handleAnalyseClick = async () => {
    if (!file && !url.trim()) {
      setError("Please upload a file or enter a URL before analysing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (url.trim()) {
        // API call for single URL
        const response = await fetch(
          "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/prediction/single_url",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ url }),
          }
        );

        const data = await response.json();

        if (data.error_code === 0) {
          setResults([data.data]);
          setShowResults(true);
        } else {
          setError("Error from API: " + data.message);
        }
      } else if (file) {
        // API call for file upload
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/prediction/file_upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (data.error_code === 0) {
          setResults(data.items);
          setShowResults(true);
        } else {
          setError("Error from API: " + data.message);
        }
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    backgroundColor: "#f6f9fc",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  };

  const wrapperStyle = {
    width: "100%",
    maxWidth: "600px",
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

  return (
    <>
      <ANavigationBar />

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
                {loading ? "Analysing..." : "Analyse"} <FaPaperPlane />
              </button>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: "1.5rem" }}>Analysis Results</h3>
              {results.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: item.detection ? "#ffe6e6" : "#e6ffe6",
                    borderLeft: `5px solid ${item.detection ? "red" : "green"}`,
                    padding: "1rem",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                    textAlign: "left",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <strong>URL:</strong> {item.original_url}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Detection:</strong>{" "}
                    <span style={{ color: item.detection ? "red" : "green" }}>
                      {item.detection ? "Detected" : "Benign"}
                    </span>
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Classifier:</strong> {item.classifier}
                  </p>
                </div>
              ))}

              <button
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1.5rem",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#1a00ff",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowResults(false);
                  setResults([]);
                  setFile(null);
                  setUrl("");
                }}
              >
                Analyse Another
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AAnalysis;
