import React, { useState } from "react";
import { Table, Button, Card, Form } from "react-bootstrap";
import UNavigationBar from "./uNavigation/UNavigationBar";

const UHistory = () => {
  // Example history data
  const [history, setHistory] = useState([
    {
      id: 1,
      url: "http://malicious-site.com",
      malwareType: "Trojan",
      severity: "High",
      accuracy: "94%",
      submitted: false,
    },
    {
      id: 2,
      url: "http://suspicious-download.com",
      malwareType: "Ransomware",
      severity: "Medium",
      accuracy: "87%",
      submitted: false,
    },
    {
      id: 3,
      url: "http://botnet-injection.net",
      malwareType: "Botnet",
      severity: "High",
      accuracy: "91%",
      submitted: false,
    },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const updated = history.map((item) =>
      selectedIds.includes(item.id)
        ? { ...item, submitted: true }
        : item
    );
    setHistory(updated);
    setSelectedIds([]);
    alert("Selected URLs submitted to admin!");
    // Optional: send to API
  };

  return (
    <>
      <UNavigationBar />
      <div className="p-4">
        <Card style={{ borderRadius: "16px", padding: "1rem", maxWidth: "1000px", margin: "0 auto" }}>
          <Card.Title className="mb-4 text-center">URL Classification History</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Select</th>
                <th>URL</th>
                <th>Malware Type</th>
                <th>Severity</th>
                <th>Accuracy</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedIds.includes(entry.id)}
                      disabled={entry.submitted}
                      onChange={() => handleSelect(entry.id)}
                    />
                  </td>
                  <td>{entry.url}</td>
                  <td>{entry.malwareType}</td>
                  <td style={{ color: entry.severity === "High" ? "red" : "orange" }}>
                    {entry.severity}
                  </td>
                  <td>{entry.accuracy}</td>
                  <td style={{ fontWeight: "bold", color: entry.submitted ? "green" : "gray" }}>
                    {entry.submitted ? "Submitted" : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-end mt-3">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedIds.length === 0}
            >
              Submit to Admin
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default UHistory;
