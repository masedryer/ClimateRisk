"use client"; // Ensure this is at the top for Client Component

import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";

const Mission = ({ src, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: isMobile ? "auto" : "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        flexDirection: "column",
        padding: isMobile ? "2em" : "4em",
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={src || "/fallbackImage.png"}
        alt={title || "Mission Image"}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(6px) brightness(0.5)",
          zIndex: -1,
        }}
      />

      {/* Overlay Text */}
      <Box sx={{ color: "white", padding: "2em", maxWidth: "80%", margin: "0 auto" }}>
        <Typography variant={isMobile ? "h4" : "h2"} gutterBottom>
          Our Mission
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} paragraph>
          We are committed to empowering users with intelligent, data-driven solutions
          that enhance decision-making and streamline workflows.
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} paragraph>
          By integrating powerful analytics, machine learning insights, and comprehensive
          documentation, our platform simplifies complexity and unlocks new opportunities.
        </Typography>
      </Box>
    </Box>
  );
};

export default Mission;
