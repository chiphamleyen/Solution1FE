import React, { useEffect, useState } from "react";
import { Table, Button, Card, Alert, Spinner, Pagination, Container, Row, Col } from "react-bootstrap";
import UNavigationBar from "./uNavigation/UNavigationBar";
import axios from "axios";

const UHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 10;

  const token = localStorage.getItem("user_token");
  if (!token) {
    window.location.href = "/";
    return null;
  }

  const fetchHistory = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/user_history?min_date=2025-01-01&max_date=2030-06-01&page=${pageNumber}&size=${PAGE_SIZE}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory(res.data.items);
      setTotalPages(Math.ceil((res.data.total || 0) / PAGE_SIZE)); // Assuming `total_pages` is returned
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
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <UNavigationBar />
      <Container className="p-4 d-flex justify-content-center">
        <Card style={{ borderRadius: "16px", padding: "1rem", width: "100%", maxWidth: "1000px" }}>
          <Card.Title className="mb-4 text-center">URL Classification History</Card.Title>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}

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
                      <td>{entry.original_url}</td>
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

              {/* Pagination Controls */}
              <div className="d-flex justify-content-center mt-3">
                <Pagination>
                  <Pagination.Prev onClick={handlePrev} disabled={page === 1} />
                  <Pagination.Item active>{page}</Pagination.Item>
                  <Pagination.Next onClick={handleNext} disabled={page === totalPages} />
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
