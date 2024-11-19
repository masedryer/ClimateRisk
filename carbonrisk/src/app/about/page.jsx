"use client"; // Ensure this is at the top for Client Component

import React from "react";
import { Container, Grid, Typography, Button, Box, Paper } from "@mui/material";
import { styled } from "@mui/system";
import SectionHeader from "@/components/ui/SectionHeader";

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

const Section = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(6),
  width: "100%",
  maxWidth: "100%",
}));

const SubSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(6),
  width: "100%",
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  height: 400,
  width: 600,
  borderRadius: 12,
  marginLeft: theme.spacing(4),
  flex: "0 1 45%",
  backgroundImage: "url(/path/to/image.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(2),
}));

const MissionSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(6),
  padding: theme.spacing(2),
}));

const About = () => {
  return (
    <div>
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

      <Container maxWidth={false}>
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
