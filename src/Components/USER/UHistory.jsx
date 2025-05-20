import React, { useEffect, useState } from "react";
import "../ADMIN/Common-Page.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Table, Button, Card, Alert, Spinner, Pagination, Container, Row, Col, Form } from "react-bootstrap";
import UNavigationBar from "./UNavigation/UNavigationBar";
import axios from "axios";

const UHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedMalwareType, setSelectedMalwareType] = useState(null);
  
  // Format date to YYYY-MM-DD in local timezone
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set default dates (7 days ago to today)
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    // Set start date to beginning of day
    start.setHours(0, 0, 0, 0);
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDates());

  const token = localStorage.getItem("user_token");
  if (!token) {
    window.location.href = "/";
    return null;
  }

  const fetchHistory = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const endDateWithTime = `${dateRange.end}T23:59:59.999`;
      const url = `https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/user_history?min_date=${dateRange.start}&max_date=${endDateWithTime}&page=${pageNumber}&size=${pageSize}${selectedMalwareType ? `&classifier=${selectedMalwareType}` : ''}`;
      const res = await axios.get(
        url,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory(res.data.items);
      console.log(res.data);
      setTotalPages(Math.ceil((res.data.total || 0) / pageSize));
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async (id) => {
    try {
      await axios.put(
        `https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/${id}/submit_for_approval`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, approved: "Pending" } : item
        )
      );
      setSuccessMessage("URL submitted for approval successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit. Try again.");
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page, dateRange, pageSize, selectedMalwareType]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page when date changes
  };

  // Get today's date in local timezone
  const getToday = () => {
    return formatDate(new Date());
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleMalwareTypeChange = (e) => {
    setSelectedMalwareType(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <>
      <UNavigationBar />
      <Container className="p-4 d-flex justify-content-center">
        <Card style={{ borderRadius: "16px", padding: "1rem", width: "100%", maxWidth: "1000px" }}>
          <Card.Title className="mb-4 text-center">URL Classification History</Card.Title>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          {/* Date Range Selection */}
          <div className="mb-4 d-flex justify-content-center gap-3 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="start" className="mb-0">From:</label>
              <input
                type="date"
                id="start"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
                max={dateRange.end}
                className="form-control"
                style={{ width: '200px' }}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="end" className="mb-0">To:</label>
              <input
                type="date"
                id="end"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
                min={dateRange.start}
                max={getToday()}
                className="form-control"
                style={{ width: '200px' }}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="malwareType" className="mb-0">Type:</label>
              <Form.Select
                id="malwareType"
                value={selectedMalwareType || ""}
                onChange={handleMalwareTypeChange}
                style={{ width: '200px' }}
                size="sm"
              >
                <option value="">All Types</option>
                <option value="Benign">Benign</option>
                <option value="Phishing">Phishing</option>
                <option value="Defacement">Defacement</option>
                <option value="Malware">Malware</option>
              </Form.Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Malware Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry._id}>
                      <td style={{ 
                        maxWidth: '400px', 
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        overflowWrap: 'break-word'
                      }}>
                        {entry.original_url}
                      </td>
                      <td>{entry.classifier}</td>
                      <td>
                        {entry.approved == null || entry.approved === undefined ? (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleSubmitForApproval(entry._id)}
                          >
                            Submit for Approval
                          </Button>
                        ) : (
                          <span style={{ fontWeight: "bold", color: "green" }}>
                            {entry.approved}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Enhanced Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-muted">
                    Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, history.length)} of {history.length} entries
                  </div>
                  <Form.Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    style={{ width: 'auto' }}
                    size="sm"
                  >
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </Form.Select>
                </div>
                <Pagination>
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                  <Pagination.Prev onClick={handlePrev} disabled={page === 1} />
                  
                  {/* Show first page */}
                  {page > 2 && (
                    <>
                      <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                      {page > 3 && <Pagination.Ellipsis disabled />}
                    </>
                  )}

                  {/* Show pages around current page */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 || // First page
                      pageNumber === totalPages || // Last page
                      (pageNumber >= page - 1 && pageNumber <= page + 1) // Pages around current
                    ) {
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === page}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    }
                    return null;
                  })}

                  {/* Show last page */}
                  {page < totalPages - 1 && (
                    <>
                      {page < totalPages - 2 && <Pagination.Ellipsis disabled />}
                      <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                      </Pagination.Item>
                    </>
                  )}

                  <Pagination.Next onClick={handleNext} disabled={page === totalPages} />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
                </Pagination>
              </div>
            </>
          )}
        </Card>
      </Container>
    </>
  );
};

export default UHistory;
