import React, { useEffect, useState } from "react";
import "./Common-Page.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import ANavigationBar from "./ANavigation/ANavigationBar";
import axios from "axios";
import { ResponsiveContainer } from "recharts";

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
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#666"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ADash = () => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    window.location.href = "/";
    return null;
  }

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
    start.setDate(start.getDate() - 6); // 7 days including today
    
    // Set start date to beginning of day (00:00:00)
    start.setHours(0, 0, 0, 0);
    
    // Set end date to end of day (23:59:59.999)
    end.setHours(23, 59, 59, 999);
    
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  // Get today's date in local timezone
  const getToday = () => {
    return formatDate(new Date());
  };

  // ------------------- State -------------------
  const [dateRange, setDateRange] = useState(getDefaultDates());
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  const [historyData, setHistoryData] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  const [approvedData, setApprovedData] = useState([]);
  const [approvedPage, setApprovedPage] = useState(1);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [approvedLoading, setApprovedLoading] = useState(true);
  const [approvedError, setApprovedError] = useState(null);

  const size = 5;
  const size10 = 10;

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDate = new Date(value);
    
    if (name === 'start') {
      // Set start date to beginning of day
      newDate.setHours(0, 0, 0, 0);
    } else if (name === 'end') {
      // Set end date to end of day
      newDate.setHours(23, 59, 59, 999);
    }

    setDateRange(prev => ({
      ...prev,
      [name]: formatDate(newDate)
    }));
    setHistoryPage(1); // Reset to first page when date changes
    setApprovedPage(1); // Reset approved page when date changes
  };

  // ------------------- API Calls -------------------

  const fetchPieData = async () => {
    setChartLoading(true);
    try {
      const response = await axios.get(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/report/admin_report",
        {
          params: {
            min_date: dateRange.start,
            max_date: `${dateRange.end}T23:59:59.999`, // Include full end day
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
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/all_history",
        {
          params: {
            min_date: dateRange.start,
            max_date: `${dateRange.end}T23:59:59.999`, // Include full end day
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
      setHistoryTotalPages(Math.ceil((response.data.total || 0) / size));
    } catch (error) {
      setHistoryError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchApproved = async (page) => {
    setApprovedLoading(true);
    try {
      const response = await axios.get(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/approved_global_history",
        {
          params: {
            min_date: dateRange.start,
            max_date: `${dateRange.end}T23:59:59.999`, // Include full end day
            page,
            size,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApprovedData(response.data.items || []);
      setApprovedTotalPages(Math.ceil((response.data.total || 0) / size));
    } catch (error) {
      setApprovedError(error.message);
    } finally {
      setApprovedLoading(false);
    }
  };

  // ------------------- Effects -------------------
  useEffect(() => {
    fetchPieData();
  }, [dateRange]);

  useEffect(() => {
    fetchHistory(historyPage);
  }, [historyPage, dateRange]);

  useEffect(() => {
    fetchApproved(approvedPage);
  }, [approvedPage, dateRange]);

  // ------------------- Render -------------------
  return (
    <div className="commonStyle">
      <ANavigationBar />
      <Container className="mt-4">
        {/* Date Range Selection */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-center gap-3 align-items-center">
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
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          {/* URL Type Distribution */}
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>URL Type Distribution</Card.Title>
                {chartLoading ? (
                  <p>Loading chart...</p>
                ) : chartError ? (
                  <p className="text-danger">Error: {chartError}</p>
                ) : (
                  <div style={{ width: "100%", height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="total"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          labelLine={true}
                          label={renderCustomizedLabel}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value}`, name]} />
                        <Legend 
                          layout="vertical" 
                          align="right"
                          verticalAlign="middle"
                          formatter={(value, entry, index) => (
                            <span style={{ color: '#666' }}>{`${value} (${chartData[index]?.total || 0})`}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Recently Approved URLs */}
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Recently Approved URLs</Card.Title>
                {approvedLoading ? (
                  <p>Loading approved URLs...</p>
                ) : approvedError ? (
                  <p className="text-danger">Error: {approvedError}</p>
                ) : (
                  <>
                    <ul className="list-group">
                      {approvedData.map((item, idx) => (
                        <li key={idx} className="list-group-item">
                          <strong>{item.classifier}</strong> –{" "}
                          <a
                            href={
                              item.original_url.startsWith("http")
                                ? item.original_url
                                : `http://${item.original_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.original_url}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        variant="outline-secondary"
                        disabled={approvedPage === 1}
                        onClick={() => setApprovedPage((prev) => prev - 1)}
                      >
                        &laquo; Previous
                      </Button>
                      <span>
                        Page {approvedPage} of {approvedTotalPages}
                      </span>
                      <Button
                        variant="outline-secondary"
                        disabled={approvedPage === approvedTotalPages}
                        onClick={() => setApprovedPage((prev) => prev + 1)}
                      >
                        Next &raquo;
                      </Button>
                    </div>
                  </>
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
                                    : "orange",
                                fontWeight: "bold",
                              }}
                            >
                              {entry.approved}
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

export default ADash;
