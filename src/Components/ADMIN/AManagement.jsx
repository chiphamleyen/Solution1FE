import React from "react";
import ANavigationBar from "../ADMIN/ANavigation/ANavigationBar";
import { Card, ListGroup } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const userLineChart = [
  {
    name: "DDOS",
    Dataset1: 4000,
    Dataset2: 2400,
    amt: 2400,
  },
  {
    name: "Virus",
    Dataset1: 3000,
    Dataset2: 1398,
    amt: 2210,
  },
  {
    name: "Worm",
    Dataset1: 2000,
    Dataset2: 9800,
    amt: 2290,
  },
  {
    name: "Trojan",
    Dataset1: 2780,
    Dataset2: 3908,
    amt: 2000,
  },
  {
    name: "Rootkit",
    Dataset1: 1890,
    Dataset2: 4800,
    amt: 2181,
  },
  {
    name: "Ransomware",
    Dataset1: 2390,
    Dataset2: 3800,
    amt: 2500,
  },
  {
    name: "Botnets",
    Dataset1: 3490,
    Dataset2: 4300,
    amt: 2100,
  },
];

const AManagement = () => {
  const containerStyle = {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: "1rem",
    // backgroundColor: "#1a1a2e", // Optional: background color
  };

  const cardStyle = {
    width: "90%",
    height: "48%", // Slightly less than 50% to allow spacing
    overflowY: "auto",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    // color: "white",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  return (
    <div className="commonStyle">
      <ANavigationBar />

      <div style={containerStyle}>
        {/* Top Card */}
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>Users logs over time</Card.Title>
            <ResponsiveContainer width={1600} height={350}>
              <LineChart
                width={500}
                height={300}
                data={userLineChart}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Dataset1"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="Dataset2" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        {/* Bottom Card with List */}
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>Users</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>User 1</ListGroup.Item>
              <ListGroup.Item>User 2</ListGroup.Item>
              <ListGroup.Item>User 3</ListGroup.Item>
              <ListGroup.Item>User 4</ListGroup.Item>
              <ListGroup.Item>User 5</ListGroup.Item>
              <ListGroup.Item>User 6</ListGroup.Item>
              <ListGroup.Item>User 7</ListGroup.Item>
              <ListGroup.Item>User 8</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AManagement;
