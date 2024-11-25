"use client"; // Ensure this is at the top for Client Component

import React from "react";
import { Box } from "@mui/material";

const Mission = ({ src, title }) => {
  return (
    <Box
      sx={{
        width: "100wv", // Full screen width
        height: 500, // Fixed height for the image
        position: "relative",
        overflow: "hidden", // Prevent scrolling
        marginTop: "1.6em",
        marginBottom: "0.9em",
        boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
        borderRadius: "8px",
      }}
    >
      <Box
        component="img"
        src={src || "/fallbackImage.svg"} // Fallback image URL
        alt={title || "Mission Image"}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%", // Ensure full width
          height: "100%", // Ensure full height
          objectFit: "cover", // Ensures the image is cropped to fit the container
        }}
      />
    </Box>
  );
};

export default Mission;
