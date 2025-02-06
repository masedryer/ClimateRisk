"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import React from "react";
import { AuthProvider } from '../lib/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from "@/components/ui/Navbar/navbar";
import Footer from "@/components/ui/Footer";
import "./globals.css";

// Create a custom theme
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
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <ProtectedRoute>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                }}
              >
                <Navbar />
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    width: '100%',
                  }}
                >
                  {children}
                </Box>
                <Footer />
              </Box>
            </ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}