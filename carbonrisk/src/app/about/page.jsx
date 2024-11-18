"use client"; // Ensure this is at the top for Client Component

import React from "react";
import { Container, Grid, Typography, Button, Box, Paper } from "@mui/material";
import { styled } from "@mui/system";
import SectionHeader from "@/components/ui/SectionHeader";

// Custom styled components for layout
const HeroSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  marginBottom: theme.spacing(6),
}));

const HeroText = styled(Box)(({ theme }) => ({
  maxWidth: "50%",
  paddingRight: theme.spacing(4), // Added consistent padding
}));

const HeroImage = styled(Box)(({ theme }) => ({
  maxWidth: "45%",
  backgroundImage: "url(/path/to/your/hero-image.jpg)", // Hero image placeholder
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: 400,
  borderRadius: 12,
  width: "100%",
  padding: theme.spacing(2), // Added padding for consistency
}));

const Section = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6),
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(6),
}));

const SubSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2), // Added padding for consistency
  marginBottom: theme.spacing(6),
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  height: 400, // Adjusted to fixed height
  width: 600, // Fixed width for consistent sizing
  borderRadius: 12,
  marginLeft: theme.spacing(4),
  flex: "0 1 45%",
  backgroundImage: "url(/path/to/image.jpg)", // Image placeholder
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(2), // Added padding for consistency
}));

const MissionSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(6),
  padding: theme.spacing(2), // Added padding for consistency
}));

const About = () => {
  return (
    <div>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <HeroSection>
          <HeroText>
            <Typography variant="h2" component="h1" gutterBottom>
              Satellite Image Prediction
            </Typography>
            <Typography variant="h5" paragraph>
              Experience the power of data science with our machine learning
              project, turning complex data into actionable insights.
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Learn More
            </Button>
          </HeroText>
          <HeroImage />
        </HeroSection>

        {/* Project Risks */}
        <Section>
          <SectionHeader
            title="Amount of Project Risks"
            subtitle="Data Visualization"
          />
          <SubSection>
            <Box>
              <Typography variant="h5" gutterBottom>
                Discover the distribution of project risks through our intuitive
                pie chart visualization, tailored to your specific data science
                needs.
              </Typography>
              <Button variant="contained" color="secondary" size="large">
                Learn More
              </Button>
            </Box>
            <ImagePlaceholder />
          </SubSection>
        </Section>

        {/* Project Recommendations */}
        <Section>
          <SectionHeader
            title="Project Recommendations"
            subtitle="Smart Solutions"
          />
          <SubSection>
            <Box>
              <Typography variant="h5" gutterBottom>
                Based on data-driven analysis, we recommend project paths that
                help mitigate risks and optimize success.
              </Typography>
              <Button variant="contained" color="primary" size="large">
                Learn More
              </Button>
            </Box>
            <ImagePlaceholder />
          </SubSection>
        </Section>

        {/* Machine Learning Insights */}
        <Section>
          <SectionHeader
            title="Machine Learning Insights"
            subtitle="Advanced Analytics"
          />
          <SubSection>
            <ImagePlaceholder />
            <Box>
              <Typography variant="h5" gutterBottom>
                By leveraging the power of machine learning and predictive
                analytics, we've identified key risks and recommended projects
                that can optimize your data science initiatives.
              </Typography>
              <Button variant="contained" color="secondary" size="large">
                Learn More
              </Button>
            </Box>
          </SubSection>
        </Section>

        {/* Mission Section */}
        <MissionSection>
          <Box>
            <ImagePlaceholder />
            <ImagePlaceholder />
          </Box>
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              At the heart of our machine learning project is a commitment to
              revolutionizing how organizations handle data and project risk. We
              provide the tools and insights necessary to make smarter,
              data-driven decisions.
            </Typography>
          </Box>
        </MissionSection>
      </Container>
    </div>
  );
};

export default About;
