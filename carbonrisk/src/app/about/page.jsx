"use client"; // Ensure this is at the top for Client Component

import React from "react";
import Link from "next/link";
import "../globals.css";
import { Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import SectionHeader from "@/components/ui/SectionHeader";
import Mission from "@/components/ui/Mission"; // Make sure the import path is correct

const HeroSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(6),
  backgroundColor: theme.palette.grey[100],
  borderRadius: 12,
  width: "100%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column", // Stack vertically on smaller screens
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
}));

const HeroText = styled(Box)(({ theme }) => ({
  maxWidth: "50%",
  paddingRight: theme.spacing(4),
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

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  "& svg": {
    width: 40,
    height: 40,
  },
}));

const ColumnTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

const ColumnContent = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  flex: 1,
  display: "flex",
  alignItems: "center",
}));

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroWrapper>
        <HeroSection>
          <HeroText>
            <Typography variant="h2" component="h1" gutterBottom>
              Carbon Credit Risk Project
            </Typography>
            <Typography variant="h5" paragraph>
              Experience the power of machine learning with templates that you
              can use for your project, turning complex data into actionable
              insights.
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Learn More
            </Button>
          </HeroText>
          <HeroImage />
        </HeroSection>
      </HeroWrapper>

      <Box sx={{ width: "100%" }}>
        {" "}
        {/* Replaced Container with Box */}
        <ThreeColumnSection>
          {/* Dashboard Card */}
          <Column>
            <IconWrapper>
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207"
                />
              </svg>
            </IconWrapper>
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
            <IconWrapper>
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                />
              </svg>
            </IconWrapper>
            <ColumnTitle variant="h5">Machine Learning Predictor</ColumnTitle>
            <ColumnContent variant="body1">
              Input the given fields and sit back as our Machine Learning Predictor generates and forecasts 
              the direction your project is headed for you.
            </ColumnContent>
            <Link href="/predictor" passHref>
              <Button variant="contained" color="primary" size="large">
                Use Predictor
              </Button>
            </Link>
          </Column>

          {/* Docs Card */}
          <Column>
            <IconWrapper>
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914"
                />
              </svg>
            </IconWrapper>
            <ColumnTitle variant="h5">Extensive Documentation</ColumnTitle>
            <ColumnContent variant="body1">
              Explore transparent data and the comprehensive technologies powering our project. 
              Gain in-depth insights into our methodologies, frameworks, and system architecture.
            </ColumnContent>
            <Link href="/docs" passHref>
              <Button variant="contained" color="secondary" size="large">
                Read Docs
              </Button>
            </Link>
          </Column>
        </ThreeColumnSection>
        <Mission src="/missionimage.png" title="Mission" />
      </Box>
    </div>
  );
};

export default About;
