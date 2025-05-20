import React, { useState, useEffect } from "react";
import ANavigationBar from "../ADMIN/ANavigation/ANavigationBar";
import { Table, Button, Card, Pagination, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const ASubmissionReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [totalPending, setTotalPending] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [totalApproved, setTotalApproved] = useState(0);
  const [approvedPage, setApprovedPage] = useState(1);
  const [loadingApproved, setLoadingApproved] = useState(true);
  const [errorApproved, setErrorApproved] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchPendingSubmissions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchApprovedSubmissions(approvedPage);
  }, [approvedPage]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/";
    }
    return {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchPendingSubmissions = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/pending_approvals_history?min_date=2025-01-01&max_date=2025-06-01&page=${page}&size=${itemsPerPage}`,
        getAuthHeader()
      );
      const data = response.data;
      setSubmissions(data.items);
      setTotalPending(data.total);
      setError(null);
    } catch (err) {
      setError("Failed to load pending submissions");
    }
    setLoading(false);
  };

  const fetchApprovedSubmissions = async (page) => {
    setLoadingApproved(true);
    try {
      const response = await axios.get(
        `https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/recent_approvals_history?page=${page}&size=${itemsPerPage}`,
        getAuthHeader()
      );
      const data = response.data;
      setApprovedSubmissions(data.items);
      setTotalApproved(data.total);
      setErrorApproved(null);
    } catch (err) {
      setErrorApproved("Failed to load approved submissions");
    }
    setLoadingApproved(false);
  };

  const handleDecision = async (id, decision) => {
    try {
      const url = `https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/${id}/${decision}`;
      await axios.put(url, null, getAuthHeader());
      // Remove the updated submission from the list
      setSubmissions((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(`Failed to ${decision} submission`);
    }
  };

  const renderPagination = (total, activePage, setPageFn) => {
    const pages = Math.ceil(total / itemsPerPage);
    return (
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          {[...Array(pages)].map((_, idx) => (
            <Pagination.Item
              key={idx}
              active={idx + 1 === activePage}
              onClick={() => setPageFn(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    );
  };

  return (
    <div className="commonStyle">
      <ANavigationBar />

      {/* Pending Submissions */}
      <Card className="m-4">
        <Card.Body>
          <Card.Title>All URL Submissions</Card.Title>

          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Malware Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((item) => (
                    <tr key={item._id}>
                      <td>{item.original_url}</td>
                      <td>{item.classifier}</td>
                      <td style={{ fontWeight: "bold", color: "gray" }}>
                        {item.approved}
                      </td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDecision(item._id, "approve")}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDecision(item._id, "reject")}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {renderPagination(totalPending, currentPage, setCurrentPage)}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Approved Submissions */}
      <Card className="m-4">
        <Card.Body>
          <Card.Title>Recently Approved Submissions</Card.Title>

          {loadingApproved && <Spinner animation="border" />}
          {errorApproved && <Alert variant="danger">{errorApproved}</Alert>}

          {!loadingApproved && !errorApproved && (
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
                  {approvedSubmissions.map((item) => (
                    <tr key={item._id}>
                      <td>{item.original_url}</td>
                      <td>{item.classifier}</td>
                      <td style={{ fontWeight: "bold", color: "green" }}>{item.approved}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </Table>
              {renderPagination(totalApproved, approvedPage, setApprovedPage)}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ASubmissionReview;
