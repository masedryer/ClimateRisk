"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ChartCard = ({
  title,
  data,
  filterRange,
  getXAxisTicks,
  countryList,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Year" ticks={getXAxisTicks(filterRange)} />
              <YAxis
                domain={
                  title === "NDVI"
                    ? [0, 1]
                    : title === "Max Temperature (°C)"
                    ? [-10, 50]
                    : title === "Summer Precipitation (mm)"
                    ? [0, 5000]
                    : title === "Forest Area (%)"
                    ? [0, 100]
                    : title === "Night Light (DN value)"
                    ? [0, 63]
                    : ["auto", "auto"]
                }
              />
              <Tooltip />
              <Legend />
              {countryList.map((country, idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey="Value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
