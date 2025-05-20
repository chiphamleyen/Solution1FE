import React, { useState } from "react";
import "../ADMIN/Common-Page.css";
import { FaPaperPlane, FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import UNavigationBar from "./UNavigation/UNavigationBar";


const UAnalysis = () => {

  const token = localStorage.getItem("user_token");
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
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all"); // "all", "detected", "benign"
  const resultsPerPage = 15;

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

  // Filter results based on selected filter
  const filteredResults = results.filter(item => {
    if (filter === "all") return true;
    if (filter === "detected") return item.detection;
    if (filter === "benign") return !item.detection;
    return true;
  });

  // Update pagination logic to use filtered results
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Số trang tối đa hiển thị

    if (totalPages <= maxVisiblePages) {
      // Nếu tổng số trang ít hơn maxVisiblePages, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu tiên
      pageNumbers.push(1);

      // Tính toán các trang ở giữa
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Điều chỉnh startPage và endPage để luôn hiển thị maxVisiblePages - 2 trang
      if (currentPage <= 2) {
        endPage = maxVisiblePages - 1;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - (maxVisiblePages - 2);
      }

      // Thêm dấu ... nếu cần
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Thêm các trang ở giữa
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Thêm dấu ... nếu cần
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Luôn hiển thị trang cuối cùng
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
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
    boxSizing: "border-box",
  };

  const wrapperStyle = {
    width: "90%",
    maxWidth: "1200px",
    padding: "2rem",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    margin: "0 auto",
  };

  const uploadBoxStyle = {
    width: "100%",
    minHeight: "200px",
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
    transition: "all 0.3s ease",
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
                <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "1rem" }}>{error}</p>
              )}
              {file && (
                <p style={{ color: "green", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  File selected: {file.name}
                </p>
              )}

              <p style={{ margin: "1.5rem 0", fontWeight: "bold", fontSize: "1.1rem" }}>OR</p>

              <input
                type="text"
                placeholder="Paste URL to dataset..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  marginBottom: "1.5rem",
                  boxSizing: "border-box",
                }}
              />

              <button onClick={handleAnalyseClick} style={buttonStyle}>
                {loading ? "Analysing..." : "Analyse"} <FaPaperPlane />
              </button>
            </>
          ) : (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Analysis Results</h3>
                
                {/* Filter Controls */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <FaFilter style={{ color: '#666' }} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="all">All Results</option>
                    <option value="detected">Malware Detected</option>
                    <option value="benign">Benign</option>
                  </select>
                </div>
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: "1rem",
                width: "100%"
              }}>
                {currentResults.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: item.detection ? "#ffe6e6" : "#e6ffe6",
                      borderLeft: `5px solid ${item.detection ? "red" : "green"}`,
                      padding: "1.5rem",
                      borderRadius: "10px",
                      textAlign: "left",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <p style={{ margin: "0 0 0.5rem 0", wordBreak: "break-all" }}>
                      <strong>URL:</strong> {item.original_url}
                    </p>
                    <p style={{ margin: "0 0 0.5rem 0" }}>
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
              </div>

              {/* Show message when no results match filter */}
              {currentResults.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  marginTop: '1rem'
                }}>
                  No results match the selected filter
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '2rem',
                  marginBottom: '1rem'
                }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '5px',
                      backgroundColor: currentPage === 1 ? '#ccc' : '#1a00ff',
                      color: '#fff',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FaChevronLeft /> Previous
                  </button>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    {getPageNumbers().map((pageNum, index) => (
                      pageNum === '...' ? (
                        <span key={`ellipsis-${index}`} style={{ padding: '0 0.5rem' }}>...</span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '5px',
                            backgroundColor: currentPage === pageNum ? '#1a00ff' : '#f0f0f0',
                            color: currentPage === pageNum ? '#fff' : '#000',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {pageNum}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '5px',
                      backgroundColor: currentPage === totalPages ? '#ccc' : '#1a00ff',
                      color: '#fff',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}

              <button
                style={{
                  marginTop: "1rem",
                  padding: "0.8rem 2rem",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#1a00ff",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  setShowResults(false);
                  setResults([]);
                  setFile(null);
                  setUrl("");
                  setCurrentPage(1);
                  setFilter("all"); // Reset filter
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

export default UAnalysis;
