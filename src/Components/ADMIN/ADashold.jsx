import React from "react";
import "./Common-Page.css";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Sector,
  LineChart,
  Line,
} from "recharts";

import { Container, Row, Col, Card } from "react-bootstrap";
import ANavigationBar from "./ANavigation/ANavigationBar";

// ############################################################################################################################################

const BarGraphData = [
  {
    name: "Page A",
    Malware: 4000,
    Benign: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    Malware: 3000,
    Benign: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    Malware: 2000,
    Benign: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    Malware: 2780,
    Benign: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    Malware: 1890,
    Benign: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    Malware: 2390,
    Benign: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    Malware: 3490,
    Benign: 4300,
    amt: 2100,
  },
];

const PieChartData = [
  { name: "HearBeat", value: 400 },
  { name: "FileDownload", value: 300 },
  { name: "abc", value: 300 },
  { name: "Others", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={10}
    >
      {`${PieChartData[index].name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const RadarChartValue = [
  {
    subject: "DDOS",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "Virus",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Worm",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Trojan",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "Rootkit",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "Ransomware",
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

const LineGraph = [
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

const CustomizedLabel = ({ x, y, stroke, value }) => (
  <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
    {value}
  </text>
);

const CustomizedAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={16}
      textAnchor="end"
      fill="#666"
      transform="rotate(-35)"
    >
      {payload.value}
    </text>
  </g>
);



// ********************************************************************
// ********************************************************************
// ********************************************************************
// *********************** SECTION BREAK ******************************
// ********************************************************************
// ********************************************************************
// ********************************************************************




const ADash = () => {
  return (
    <div className="commonStyle">
    <ANavigationBar/>

    <Container className="mt-4">
        {/* Row 1 - 3 Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Card 1</Card.Title>
                <Card.Text>This is the first card.</Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Card 2</Card.Title>
                <Card.Text>This is the second card.</Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Card 3</Card.Title>
                <Card.Text>This is the third card.</Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Row 2 - 2 Cards */}
        <Row className="mb-4 justify-content-center">
          {/* BAR CHART  */}
          <Col>
            <Card>
              <Card.Body>
              <Card.Title>Weekly Activity</Card.Title>
                <ResponsiveContainer width={600} height={300}>
                  <BarChart
                    width={500}
                    height={300}
                    data={BarGraphData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="Benign" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="Malware" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          {/* PIE CHART */}
          <Col>
            <Card>
              <Card.Body>
              <Card.Title>Malware Activity</Card.Title>
                <ResponsiveContainer width={600} height={300}>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={PieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {PieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Row 3 - 2 Cards */}
        {/* RadarChart */}
        <Row className="justify-content-center">
          <Col>
            <Card>
              <Card.Body>
              <Card.Title>Last Uploaded Dataset</Card.Title>
                <ResponsiveContainer width={600} height={300}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={RadarChartValue}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Mike"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          {/* Line Graph */}
          <Col>
            <Card>
              <Card.Body>
              <Card.Title>Threat Score</Card.Title>
                <ResponsiveContainer width={600} height={300}>
                  <LineChart
                    width={500}
                    height={300}
                    data={LineGraph}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      height={60}
                      tick={<CustomizedAxisTick />}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Dataset1"
                      stroke="#8884d8"
                      label={<CustomizedLabel />}
                    />
                    <Line type="monotone" dataKey="Dataset2" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ADash