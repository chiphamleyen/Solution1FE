import React from "react";
import "./Common-Page.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import ANavigationBar from "./ANavigation/ANavigationBar";

// ---------------- Data ----------------
const pieChartData = [
  { name: "Benign", value: 50 },
  { name: "Malware", value: 30 },
  { name: "Phishing", value: 15 },
  { name: "Spam", value: 5 },
];

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#8884d8"];

const historyData = [
  { user: "john123", url: "http://example1.com", type: "Trojan", severity: "High", status: "Pending" },
  { user: "alice99", url: "http://safe-site.org", type: "Benign", severity: "-", status: "Accepted" },
  { user: "dev_guy", url: "http://suspicious.biz", type: "Worm", severity: "Medium", status: "Rejected" },
  { user: "new_user", url: "http://phishy.net", type: "Phishing", severity: "High", status: "Accepted" },
];

const recentApproved = [
  { url: "http://safe-site.org", type: "Benign" },
  { url: "http://trusted-source.com", type: "Benign" },
  { url: "http://clean-file.net", type: "Benign" },
];

// ---------------- Pie Label ----------------
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {`${pieChartData[index].name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

// ---------------- Component ----------------
const ADash = () => {
  return (
    <div className="commonStyle">
      <ANavigationBar />
      <Container className="mt-4">
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>URL Type Distribution</Card.Title>
                <PieChart width={400} height={300}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Recently Approved URLs</Card.Title>
                <ul className="list-group">
                  {recentApproved.map((item, idx) => (
                    <li key={idx} className="list-group-item">
                      <strong>{item.type}</strong> –{" "}
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>URL Submission History</Card.Title>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>URL</th>
                        <th>Type</th>
                        <th>Severity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((entry, i) => (
                        <tr key={i}>
                          <td>{entry.user}</td>
                          <td>{entry.url}</td>
                          <td>{entry.type}</td>
                          <td>{entry.severity}</td>
                          <td
                            style={{
                              color:
                                entry.status === "Accepted"
                                  ? "green"
                                  : entry.status === "Rejected"
                                  ? "red"
                                  : "orange",
                              fontWeight: "bold",
                            }}
                          >
                            {entry.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ADash;
