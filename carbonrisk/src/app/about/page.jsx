"use client"; // Ensure this is at the top for Client Component

import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import SectionHeader from "@/components/ui/SectionHeader";
import Mission from "@/components/ui/Mission"; // Make sure the import path is correct

const Section = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(4, 0),
  width: "100%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column", // Stack vertically on smaller screens
  },
}));

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

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  height: 300,
  width: 400,
  borderRadius: 12,
  backgroundImage: "url(/path/to/image.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  maxWidth: "50%",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
  },
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

      <Container maxWidth="lg">
        {/* First Section */}
        <Section>
          <ImagePlaceholder />
          <ContentBox>
            <Typography variant="h5" gutterBottom>
              Amount of Project Risks
            </Typography>
            <Typography variant="body1" paragraph>
              Discover the distribution of project risks through our intuitive
              pie chart visualization, tailored to your specific data science
              needs.
            </Typography>
            <Button variant="contained" color="secondary" size="large">
              Learn More
            </Button>
          </ContentBox>
        </Section>

        {/* Second Section */}
        <Section>
          <ContentBox>
            <Typography variant="h5" gutterBottom>
              Project Recommendations
            </Typography>
            <Typography variant="body1" paragraph>
              Based on data-driven analysis, we recommend project paths that
              help mitigate risks and optimize success.
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Learn More
            </Button>
          </ContentBox>
          <ImagePlaceholder />
        </Section>

        {/* Third Section */}
        <Section>
          <ImagePlaceholder />
          <ContentBox>
            <Typography variant="h5" gutterBottom>
              Machine Learning Insights
            </Typography>
            <Typography variant="body1" paragraph>
              By leveraging the power of machine learning and predictive
              analytics, we've identified key risks and recommended projects
              that can optimize your data science initiatives.
            </Typography>
            <Button variant="contained" color="secondary" size="large">
              Learn More
            </Button>
          </ContentBox>
        </Section>

        {/* Mission Section */}
        <Mission 
          src="/missionImage.svg"  // Make sure this path is correct
          title="Mission Image"     // Ensure this title matches your content
        />
      </Container>
    </div>
  );
};

export default About;
