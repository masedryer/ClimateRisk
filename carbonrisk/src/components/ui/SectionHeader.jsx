"use client";
// src/components/ui/SectionHeader.jsx
import React from "react";
import { Typography, Box } from "@mui/material";

const SectionHeader = ({ title, subtitle }) => {
  return (
    <Box sx={{ textAlign: "center", marginBottom: 4 }}>
      {subtitle && (
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", marginBottom: 1 }}
        >
          {subtitle}
        </Typography>
      )}
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
    </Box>
  );
};

export default SectionHeader;
