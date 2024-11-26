"use client";
// src/app/layout.jsx
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import Navbar from "@/components/ui/Navbar/navbar";
import Footer from "@/components/ui/Footer";
import { Box } from "@mui/material";

// Create a custom theme (you can use the default theme as well)
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    grey: {
      100: "#f5f5f5", // light grey
      200: "#eeeeee", // medium grey
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Ensures baseline styles */}
          <Navbar />
          <Box sx={{ width: "100%", padding: 0 }}>{children}</Box> {/* Fullwidth layout */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
