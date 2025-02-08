"use client"; // If you're on Next.js 13 App Router and want client-side rendering/features

import React from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";

export default function Docs() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Title */}
      <Typography variant="h3" component="h1" gutterBottom>
        Documentation
      </Typography>

      {/* Introduction Section */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Introduction
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography paragraph>
            Our website provides carbon credit project stakeholders with insights
            to evaluate and mitigate risks associated with their initiatives at
            the national level.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Scope and Purpose
          </Typography>
          <Typography paragraph>
            We offer tools and data to help stakeholders address risks in regions
            facing deforestation and complex socio-economic issues.
          </Typography>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Key Features
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem disablePadding>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Risk Predictor:</strong> Uses linear regression and
                    time-series ML to identify and forecast risks.
                  </>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Interactive Risk Dashboard:</strong> Visually rich
                    dashboard to compare and analyze trends across different
                    countries and regions.
                  </>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Access to Complex Data:</strong> Integrates satellite
                    imagery and NDVI/reforestation data.
                  </>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Time-Series ML:</strong> Predicts risk from 2002 to
                    2020 and forecasts up to 2050.
                  </>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Site Navigation & Features */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Website Navigation & Features
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography paragraph>
            The following pages are accessible under certain conditions:
          </Typography>
          <List sx={{ listStyleType: "decimal", pl: 3 }}>
            <ListItem sx={{ display: "list-item" }}>
              <ListItemText
                primary={
                  <>
                    <strong>Login/Signup</strong> (Required to access all pages
                    except &quot;About&quot;)
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <ListItemText
                primary={
                  <>
                    <strong>About</strong> (Accessible with login)
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <ListItemText
                primary={
                  <>
                    <strong>Dashboard</strong> (Only accessible with login)
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <ListItemText
                primary={
                  <>
                    <strong>Risk Predictor</strong> (Only accessible with login)
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <ListItemText
                primary={
                  <>
                    <strong>Docs</strong> (Only accessible with login)
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <ListItemText
                primary={
                  <>
                    <strong>Contact</strong> (Only accessible with login)
                  </>
                }
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Login/Signup
          </Typography>
          <Typography paragraph>
            Users can log in via Google OAuth or sign up manually using:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText primary="Compulsory fields: Email, Password, Full Name, Username" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText primary="Optional field: Bio" />
            </ListItem>
          </List>
          <Typography paragraph>
            Password reset functionality is also available for users who forget
            their password.
          </Typography>

          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography paragraph>
            The About page provides a brief introduction to the project and short
            descriptions of its features.
          </Typography>
        </CardContent>
      </Card>

      {/* Dashboard Documentation */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Dashboard Usage
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography paragraph>
            The dashboard allows users to filter, compile, and compare various
            metrics across multiple countries or regions.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Step 1: Accessing the Dashboard
          </Typography>
          <List>
            <ListItem sx={{ alignItems: "flex-start" }}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Open the Dashboard:</strong> Log in and navigate via
                    the Navbar link.
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ alignItems: "flex-start" }}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Initial View:</strong> You will see the main
                    Dashboard page with a &quot;Filters&quot; section.
                  </>
                }
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom>
            Step 2: Using the Filters
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Standard Filter:</strong> View data for any selection
                    of countries and metrics.
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Top 5 Filter:</strong> Focus on the top five
                    countries for a particular metric.
                  </>
                }
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom>
            Step 3: Selecting a Country (Standard)
          </Typography>
          <Typography paragraph>
            <strong>Choose a Country:</strong> Click the &quot;Select Country&quot;
            dropdown and pick a country.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Step 4: Choosing a Metric (Standard)
          </Typography>
          <Typography paragraph>
            <strong>Metric Dropdown:</strong> Click on the &quot;Metric&quot;
            dropdown (e.g., NDVI, Tree Cover Loss, Carbon Emission, HDI).
          </Typography>

          <Typography variant="h6" gutterBottom>
            Step 5: Adding and Viewing Selections (Standard)
          </Typography>
          <ol style={{ paddingLeft: "1.5rem" }}>
            <li>
              <strong>Add a Selection:</strong> After choosing a country and
              metric, click &quot;Add Selection.&quot;
            </li>
            <li>
              <strong>See Trends:</strong> Click &quot;See Trend&quot; to view
              trend data.
            </li>
            <li>
              <strong>Compile Data:</strong> Generates visualizations based on
              your selections.
            </li>
          </ol>

          <Typography variant="h6" gutterBottom>
            Step 6: Country/Region Selection (Top 5)
          </Typography>
          <ol style={{ paddingLeft: "1.5rem" }}>
            <li>
              <strong>Enable Top 5:</strong> Check the &quot;Top 5&quot; box to
              display additional country/region filter options.
            </li>
            <li>
              <strong>Region Selection:</strong> Choose &quot;Country&quot; or
              &quot;Region,&quot; and if &quot;Region,&quot; specify the region
              as prompted.
            </li>
          </ol>

          <Typography variant="h6" gutterBottom>
            Step 7: Choosing a Metric (Top 5)
          </Typography>
          <Typography paragraph>
            Same as Standard, select a metric such as NDVI, Carbon Emission, HDI,
            etc.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Step 8: Choosing Highest or Lowest (Top 5)
          </Typography>
          <Typography paragraph>
            Click on the respective checkbox to display the highest or lowest
            values for the chosen metric.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Step 9: Choosing a Year (Top 5)
          </Typography>
          <Typography paragraph>
            Select a year to display the top 5 countries with highest/lowest
            values of that metric.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Explanation of the Dashboard
          </Typography>
          <Typography paragraph>
            The Dashboard supports multi-level analysis for metrics like NDVI,
            Tree Cover Loss, Forest Area, Carbon Emission, HDI, FDI, Disaster
            Count, Political Stability, Population Density, and Corruption
            Index. Line charts show trends over time, while bar charts are used
            for categorical comparisons.
          </Typography>
        </CardContent>
      </Card>

      {/* Risk Predictor Documentation */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Risk Predictor Usage
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography paragraph>
            The Risk Predictor evaluates potential project risks by analyzing key
            inputs (country, project start year, end year) and returns risk
            scores, detailed explanations, and mitigation recommendations.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Step 1: Input Project Details
          </Typography>
          <ol style={{ paddingLeft: "1.5rem" }}>
            <li>
              <strong>Select Project Location:</strong> Choose the country from
              the dropdown list.
            </li>
            <li>
              <strong>Set Project Duration:</strong> Use &quot;Select Start
              Year&quot; and &quot;Select End Year&quot; dropdowns.
            </li>
          </ol>

          <Typography variant="h6" gutterBottom>
            Step 2: Analyze Risk
          </Typography>
          <Typography paragraph>
            <strong>Click &quot;Analyze Risk&quot;:</strong> Generates the risk
            analysis results based on the inputs provided.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Interpreting Results
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Risk Score:</strong> 0 (Low Risk) to 10 (High Risk),
                    with a color indicator.
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Risk Assessment Details:</strong> Key factors and
                    reasons for the assigned score (low, medium, high).
                  </>
                }
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom>
            Recommendations
          </Typography>
          <Typography paragraph>
            Recommendations are provided for mitigating identified risks,
            tailored to the project location and risk factors.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>NDVI Analysis:</strong> The NDVI image shows areas of
                    vegetation health with different colors:
                    <ul>
                      <li>
                        Purple Area: Highest NDVI (dense, healthy vegetation)
                      </li>
                      <li>
                        Green Area: Normal NDVI (moderately healthy vegetation)
                      </li>
                      <li>
                        Grey Area: Low NDVI (sparse or no vegetation)
                      </li>
                    </ul>
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Download NDVI Image:</strong> Click
                    &quot;Download Image&quot; to save NDVI for offline use.
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Export PDF:</strong> Click &quot;Export PDF&quot; to
                    download a comprehensive risk analysis report.
                  </>
                }
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom>
            Explanation
          </Typography>
          <Typography paragraph>
            The Risk Predictor uses data-driven calculations and time-series ML
            to forecast potential risks from 2025 to 2050. Scores range from 1 to
            10, with deeper insights on NDVI trends, political stability, and
            more.
          </Typography>
        </CardContent>
      </Card>

      {/* Feature Descriptions Table */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Feature Descriptions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Feature</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>ndvi</TableCell>
                  <TableCell>
                    Indicates vegetation health and density. Higher NDVI values
                    reflect healthier ecosystems that can store more carbon.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>forest_area_percentage</TableCell>
                  <TableCell>
                    Highlights the proportion of land under forest cover. A
                    higher percentage means more potential for conservation and
                    carbon storage.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>forest_area_km</TableCell>
                  <TableCell>
                    Larger forest areas provide greater potential for large-scale
                    REDD+ projects, making conservation efforts impactful.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>carbon_emission</TableCell>
                  <TableCell>
                    High emissions due to deforestation indicate priority regions
                    for REDD+ intervention to mitigate carbon release.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>disaster_count</TableCell>
                  <TableCell>
                    Frequent disasters like floods or hurricanes can hinder REDD+
                    project success.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>political_stability</TableCell>
                  <TableCell>
                    Stable governance ensures long-term REDD+ success and minimal
                    risk.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>population_density</TableCell>
                  <TableCell>
                    Higher population density often increases deforestation
                    pressure due to agriculture or urbanization.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>corruption_index</TableCell>
                  <TableCell>
                    Transparency in governance ensures the successful
                    implementation of REDD+ projects.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>hdi</TableCell>
                  <TableCell>
                    Measures a country's development level, including health,
                    education, and income. Higher HDI often correlates with
                    better governance and capacity to implement sustainable
                    forest management practices.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Foreign direct investment</TableCell>
                  <TableCell>
                    Investment made by another country's company or individuals.
                    Higher FDI means more confidence and potential investment for
                    REDD+ projects.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tree Cover Loss</TableCell>
                  <TableCell>
                    The amount of tree cover loss which has a direct impact on
                    REDD+ projects.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gross Carbon Emission</TableCell>
                  <TableCell>
                    The amount of carbon emission generated based on forest
                    related activities.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Contact Section */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Contact
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography paragraph>
            If you have questions, feedback, or need support, visit the Contact
            page for email, phone, or a contact form to reach our team.
          </Typography>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Troubleshooting
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography paragraph>
            If you encounter any issues with logging in, navigating the
            Dashboard, or generating risk analyses, please reach out via the
            Contact page. Our support team is ready to assist you.
          </Typography>
        </CardContent>
      </Card>


      {/* Navigation Buttons */}
      <Box textAlign="center" mt={4}>
        <Button variant="contained" color="primary" href="/" sx={{ mr: 2 }}>
          Go to Home
        </Button>
       
      </Box>
    </Container>
  );
}
