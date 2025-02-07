"use client"; // Ensure this is at the top for Client Component

import React from "react";
import { Box, Typography } from "@mui/material";

const Mission = ({ src, title }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={src || "/fallbackImage.png"} // Fallback image URL
        alt={title || "Mission Image"}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(6px) brightness(0.5)", // Reduced blur for subtle effect
          zIndex: -1, // Ensures it stays behind the text
        }}
      />

      {/* Overlay Text */}
      <Box sx={{ color: "white", padding: "2em", maxWidth: "80%", margin: "0 auto" }}>
        <Typography variant="h2" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="h6">
        We are committed to empowering users with intelligent, data-driven solutions that enhance decision-making and streamline workflows. By integrating powerful analytics, machine learning insights, and comprehensive documentation, our platform simplifies complexity and unlocks new opportunities. Our goal is to create an intuitive, accessible, and efficient ecosystem where users can seamlessly interact with data, gain valuable predictions, and leverage well-documented resources to maximize their potential.
        </Typography>
      </Box>
    </Box>
  );
};

export default Mission;
