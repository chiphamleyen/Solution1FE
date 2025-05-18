import React, { useState } from "react";
import ANavigationBar from "../ADMIN/ANavigation/ANavigationBar";
import { Table, Button, Card, Pagination } from "react-bootstrap";

const ASubmissionReview = () => {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      user: "janeDoe",
      url: "http://malicious-site.com",
      malwareType: "Trojan",
      severity: "High",
      accuracy: "94%",
      status: "Pending",
    },
    {
      id: 2,
      user: "janeDoe",
      url: "http://suspicious-download.com",
      malwareType: "Ransomware",
      severity: "Medium",
      accuracy: "87%",
      status: "Accepted",
    },
    {
      id: 3,
      user: "johnDoe",
      url: "http://test.com",
      malwareType: "Spyware",
      severity: "Low",
      accuracy: "75%",
      status: "Accepted",
    },
    {
      id: 4,
      user: "alice",
      url: "http://example.com",
      malwareType: "Adware",
      severity: "Low",
      accuracy: "65%",
      status: "Rejected",
    },
    // Add more for demo
  ]);

  const handleDecision = (id, decision) => {
    setSubmissions((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status: decision } : entry
      )
    );
  };

  // Pagination setup
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);

  const paginated = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderPagination = (total, activePage, setPageFn) => {
    const pages = Math.ceil(total / itemsPerPage);
    return (
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
    );
  };

  const approved = submissions.filter((s) => s.status === "Accepted");

  return (
    <div className="commonStyle">
      <ANavigationBar />

      {/* All Submissions */}
      <Card className="m-4">
        <Card.Body>
          <Card.Title>All URL Submissions</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User</th>
                <th>URL</th>
                <th>Malware Type</th>
                <th>Severity</th>
                <th>Accuracy</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated(submissions, currentPage).map((item) => (
                <tr key={item.id}>
                  <td>{item.user}</td>
                  <td>{item.url}</td>
                  <td>{item.malwareType}</td>
                  <td style={{ color: item.severity === "High" ? "red" : item.severity === "Medium" ? "orange" : "green" }}>
                    {item.severity}
                  </td>
                  <td>{item.accuracy}</td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color:
                        item.status === "Accepted"
                          ? "green"
                          : item.status === "Rejected"
                          ? "red"
                          : "gray",
                    }}
                  >
                    {item.status}
                  </td>
                  <td>
                    {item.status === "Pending" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDecision(item.id, "Accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDecision(item.id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {renderPagination(submissions.length, currentPage, setCurrentPage)}
        </Card.Body>
      </Card>

      {/* Recently Approved */}
      <Card className="m-4">
        <Card.Body>
          <Card.Title>Recently Approved Submissions</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User</th>
                <th>URL</th>
                <th>Malware Type</th>
                <th>Severity</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {paginated(approved, approvedPage).map((item) => (
                <tr key={item.id}>
                  <td>{item.user}</td>
                  <td>{item.url}</td>
                  <td>{item.malwareType}</td>
                  <td>{item.severity}</td>
                  <td>{item.accuracy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {renderPagination(approved.length, approvedPage, setApprovedPage)}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ASubmissionReview;
