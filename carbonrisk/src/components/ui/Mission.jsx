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
          We empower users with intelligent, data-driven solutions to enhance decision-making.
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} paragraph>
          Our platform integrates analytics, machine learning, and documentation to simplify complexity and unlock new opportunities.
        </Typography>
      </Box>
    </Box>
  );
};

export default Mission;
