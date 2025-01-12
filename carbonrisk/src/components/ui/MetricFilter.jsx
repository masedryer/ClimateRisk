import React from "react";

export default function MetricFilter({ metrics, selectedMetric, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Metric
      </label>
      <select
        value={selectedMetric}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded-lg"
      >
        {metrics.map((metric) => (
          <option key={metric} value={metric}>
            {metric}
          </option>
        ))}
      </select>
    </div>
  );
}
