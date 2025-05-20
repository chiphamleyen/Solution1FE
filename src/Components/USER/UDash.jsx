import React, { useEffect, useState } from "react";
import "../ADMIN/Common-Page.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer  } from "recharts";
import UNavigationBar from "./uNavigation/UNavigationBar";
import axios from "axios";

// Colors for Pie chart
const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#8884d8", "#FF6666"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  payload,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {`${payload.type} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const UDash = () => {
  const token = localStorage.getItem("user_token");
  if (!token) {
    window.location.href = "/";
    return null;
  }

  // ------------------- State -------------------
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  const [historyData, setHistoryData] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  const size = 5;
  const size10 = 10;

  // ------------------- API Calls -------------------

  const fetchPieData = async () => {
    setChartLoading(true);
    try {
      const response = await axios.get(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/report/user_report",
        {
          params: {
            min_date: "2025-01-01",
            max_date: "2025-06-01",
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = response.data?.data?.classifier || [];
      setChartData(apiData);
    } catch (error) {
      setChartError(error.message);
    } finally {
      setChartLoading(false);
    }
  };

  const fetchHistory = async (page) => {
    setHistoryLoading(true);
    try {
      const response = await axios.get(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/user_history",
        {
          params: {
            min_date: "2025-01-01",
            max_date: "2030-06-01",
            page,
            size10,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistoryData(response.data.items || []);
      setHistoryTotalPages(Math.ceil((response.data.total || 0) / size10));
    } catch (error) {
      setHistoryError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ------------------- Effects -------------------
  useEffect(() => {
    fetchPieData();
  }, []);

  useEffect(() => {
    fetchHistory(historyPage);
  }, [historyPage]);

  // ------------------- Render -------------------
  return (
    <div className="commonStyle">
      <UNavigationBar />
      <Container className="mt-4">
        <Row className="mb-4">
          {/* URL Type Distribution */}
          <Col xs={12}>
  <Card>
    <Card.Body>
      <Card.Title className="text-center">URL Type Distribution</Card.Title>
      {chartLoading ? (
        <p className="text-center">Loading chart...</p>
      ) : chartError ? (
        <p className="text-danger text-center">Error: {chartError}</p>
      ) : (
        <div style={{ width: "100%", height: 400, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="total"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card.Body>
  </Card>
</Col>
        </Row>

        {/* Submission History */}
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>URL Submission History</Card.Title>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {historyLoading ? (
                    <p>Loading...</p>
                  ) : historyError ? (
                    <p className="text-danger">Error: {historyError}</p>
                  ) : (
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>URL</th>
                          <th>Type</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.map((entry, i) => (
                          <tr key={entry._id || i}>
                            <td>{entry.original_url}</td>
                            <td>{entry.classifier}</td>
                            <td
                              style={{
                                color:
                                  entry.approved === "Approved"
                                    ? "green"
                                    : entry.approved === "Rejected"
                                    ? "red"
                                    : entry.approved === null || entry.approved === undefined
                                    ? "gray"
                                    : "orange",
                                fontWeight: "bold",
                              }}
                            >
                              {entry.approved ?? "Not Submitted"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Button
                    variant="outline-primary"
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage((prev) => prev - 1)}
                  >
                    &laquo; Previous
                  </Button>
                  <span>
                    Page {historyPage} of {historyTotalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    disabled={historyPage === historyTotalPages}
                    onClick={() => setHistoryPage((prev) => prev + 1)}
                  >
                    Next &raquo;
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UDash;
