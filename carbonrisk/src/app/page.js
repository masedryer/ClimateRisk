"use client";
import "./globals.css";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar/navbar";
import Footer from "@/components/ui/footer";

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState("Project 1");
  const [featuredIndex, setFeaturedIndex] = useState(0); // State for navigating featured projects

  // Sample data for multiple projects and reforestation metrics
  const projectData = Array.from({ length: 12 }, (_, i) => ({
    name: `${i + 1}h`,
    "Project 1": Math.floor(Math.random() * 60) + 20,
    "Project 2": Math.floor(Math.random() * 60) + 20,
  }));

  const reforestationData = [
    { name: "2015", planted: 100, survived: 85, riskLevel: "High", lost: 15 },
    { name: "2016", planted: 120, survived: 95, riskLevel: "Medium", lost: 25 },
    { name: "2017", planted: 150, survived: 140, riskLevel: "Low", lost: 10 },
    { name: "2018", planted: 180, survived: 170, riskLevel: "Low", lost: 10 },
    {
      name: "2019",
      planted: 200,
      survived: 190,
      riskLevel: "Medium",
      lost: 10,
    },
    { name: "2020", planted: 250, survived: 240, riskLevel: "Low", lost: 10 },
  ];

  const projectDetails = [
    {
      id: 1,
      name: "Project 1",
      location: "xxxxxxxxxx",
      date: "12.09.2019 - 12:53 PM",
      piece: "423",
      amount: "$34,295",
      risk: "High",
    },
    {
      id: 2,
      name: "Project 2",
      location: "xxxxxx",
      date: "12.09.2019 - 12:53 PM",
      piece: "423",
      amount: "$34,295",
      risk: "Medium",
    },
    {
      id: 3,
      name: "Project 3",
      location: "xxxxxxx",
      date: "12.09.2019 - 12:53 PM",
      piece: "423",
      amount: "$34,295",
      risk: "Low",
    },
  ];

  const analyticsData = [
    { year: 2015, value1: 30, value2: 20 },
    { year: 2016, value1: 45, value2: 35 },
    { year: 2017, value1: 55, value2: 45 },
    { year: 2018, value1: 65, value2: 55 },
    { year: 2019, value1: 90, value2: 85 },
  ];

  const handlePrevProject = () => {
    setFeaturedIndex((prevIndex) =>
      prevIndex === 0 ? projectDetails.length - 1 : prevIndex - 1
    );
  };

  const handleNextProject = () => {
    setFeaturedIndex((prevIndex) =>
      prevIndex === projectDetails.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Main Project Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Project 1"
                    stackId="1"
                    fill="#a5b4fc"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="Project 2"
                    stackId="2"
                    fill="#86efac"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Reforestation Progress - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Reforestation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reforestationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="planted" fill="#82ca9d" />
                  <Bar dataKey="survived" fill="#8884d8" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Reforestation Risk Levels - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Reforestation Risk Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reforestationData}
                    dataKey="planted"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {reforestationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.riskLevel === "High"
                            ? "#FF6347"
                            : entry.riskLevel === "Medium"
                            ? "#FFD700"
                            : "#32CD32"
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Analytics Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value1" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="value2" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Featured Project with Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {projectDetails[featuredIndex].name}
                </h2>
                <p>{projectDetails[featuredIndex].location}</p>
                <p>{projectDetails[featuredIndex].date}</p>
                <p>Pieces: {projectDetails[featuredIndex].piece}</p>
                <p>Amount: {projectDetails[featuredIndex].amount}</p>
                <p>Risk: {projectDetails[featuredIndex].risk}</p>
              </div>
              <div className="flex justify-between">
                <button onClick={handlePrevProject}>
                  <ChevronLeft />
                </button>
                <button onClick={handleNextProject}>
                  <ChevronRight />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
