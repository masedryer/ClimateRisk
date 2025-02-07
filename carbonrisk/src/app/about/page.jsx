"use client"; // Ensure this is at the top for Client Component

import React from "react";
import Link from "next/link";
import "../globals.css";
import { Typography, Button, Box, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import Mission from "@/components/ui/Mission"; // Ensure the path is correct

const HeroSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(6),
  backgroundColor: theme.palette.grey[100],
  borderRadius: 12,
  width: "100%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    padding: theme.spacing(4),
  },
}));

const HeroWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  width: "100vw",
  position: "relative",
  left: "50%",
  right: "50%",
  marginLeft: "-50vw",
  marginRight: "-50vw",
  boxSizing: "border-box",
  paddingRight: theme.spacing(6),
  paddingLeft: theme.spacing(6),
}));

const HeroImage = styled(Box)(({ theme }) => ({
  maxWidth: "85%",
  backgroundImage: 'url("/heroimage.png")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: 500,
  borderRadius: 12,
  width: "100%",
  [theme.breakpoints.down("md")]: {
    display: "none", // Hides image on smaller screens
  },
}));

const HeroText = styled(Box)(({ theme }) => ({
  maxWidth: "50%",
  paddingRight: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    paddingRight: 0,
  },
}));

const ThreeColumnSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(4),
  padding: theme.spacing(8, 0),
  margin: theme.spacing(4, "auto"),
  maxWidth: "1200px",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100vw",
    height: "100%",
    backgroundImage: "url(/image1.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.7) blur(8px)",
    zIndex: -1,
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const Column = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  borderRadius: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  boxShadow: theme.shadows[1],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(3),
  minHeight: "450px",
}));

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      {/* Hero Section */}
      <HeroWrapper>
        <HeroSection>
          <HeroText>
            <Typography
              variant={isMobile ? "h4" : "h2"}
              component="h1"
              gutterBottom
            >
              Carbon Credit Risk Project
            </Typography>
            <Typography variant={isMobile ? "body1" : "h5"} paragraph>
              Experience the power of machine learning with templates that you
              can use for your project, turning complex data into actionable
              insights.
            </Typography>
            <Button variant="contained" color="primary" size={isMobile ? "medium" : "large"}>
              Learn More
            </Button>
          </HeroText>
          {!isMobile && <HeroImage />}
        </HeroSection>
      </HeroWrapper>

      {/* Three Column Section */}
      <Box sx={{ width: "100%" }}>
        <ThreeColumnSection>
          {/* Dashboard Card */}
          <Column>
            <ColumnTitle variant="h5">Customisable Dashboard</ColumnTitle>
            <ColumnContent variant="body1">
              Get a quick overview of key insights, metrics, and analytics in a
              centralized interface. Stay informed and track performance effortlessly.
            </ColumnContent>
            <Link href="/dashboard" passHref>
              <Button variant="contained" color="secondary" size="large">
                Go to Dashboard
              </Button>
            </Link>
          </Column>

          {/* ML Predictor Card */}
          <Column>
            <ColumnTitle variant="h5">Machine Learning Predictor</ColumnTitle>
            <ColumnContent variant="body1">
              Input the given fields and sit back as our Machine Learning Predictor
              generates and forecasts the direction your project is headed for you.
            </ColumnContent>
            <Link href="/predictor" passHref>
              <Button variant="contained" color="primary" size="large">
                Use Predictor
              </Button>
            </Link>
          </Column>

          {/* Docs Card */}
          <Column>
            <ColumnTitle variant="h5">Extensive Documentation</ColumnTitle>
            <ColumnContent variant="body1">
              Explore transparent data and the comprehensive technologies powering
              our project. Gain in-depth insights into our methodologies, frameworks,
              and system architecture.
            </ColumnContent>
            <Link href="/docs" passHref>
              <Button variant="contained" color="secondary" size="large">
                Read Docs
              </Button>
            </Link>
          </Column>
        </ThreeColumnSection>

        {/* Mission Section */}
        <Mission src="/missionimage.png" title="Mission" />
      </Box>
    </div>
  );
};

export default About;
