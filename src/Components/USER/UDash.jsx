import React, { useEffect, useState } from "react";
import "../ADMIN/Common-Page.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

const UDash = () => {
  const token = localStorage.getItem("user_token");
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
  const [selectedStatus, setSelectedStatus] = useState("Approved");

  const size = 5;
  const size10 = 10;

  // Get today's date in local timezone
  const getToday = () => {
    return formatDate(new Date());
  };

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
  };

  // ------------------- API Calls -------------------

  const fetchPieData = async () => {
    setChartLoading(true);
    try {
      const response = await axios.get(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/report/user_report",
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
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/history/user_history",
        {
          params: {
            min_date: dateRange.start,
            max_date: `${dateRange.end}T23:59:59.999`, // Include full end day
            page,
            size10,
            approved_status: selectedStatus
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

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setHistoryPage(1); // Reset to first page when filter changes
  };

  // ------------------- Effects -------------------
  useEffect(() => {
    fetchPieData();
  }, [dateRange]);

  useEffect(() => {
    fetchHistory(historyPage);
  }, [historyPage, selectedStatus, dateRange]);

  // ------------------- Render -------------------
  return (
    <div className="commonStyle">
      <UNavigationBar />
      <Container className="mt-4">
        <Row className="mb-4">
          {/* Date Range Selection */}
          <Col xs={12} className="mb-4">
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
                        <Tooltip />
                        <Legend 
                          layout="vertical" 
                          align="right"
                          verticalAlign="middle"
                          formatter={(value, entry, index) => (
                            <span style={{ color: '#666' }}>{value}</span>
                          )}
                        />
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
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{ width: '200px' }}
                  >
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
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
                                color: entry.approved === "Approved" ? "green" : "red",
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

export default UDash;
