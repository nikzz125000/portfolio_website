import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="lg">
      <Box py={8}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          About Us
        </Typography>
        
        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                We are dedicated to providing innovative solutions that help businesses 
                grow and succeed in today's competitive market. Our team of experts 
                works tirelessly to deliver exceptional value to our clients.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Our Vision
              </Typography>
              <Typography variant="body1" paragraph>
                To be the leading platform that empowers businesses worldwide with 
                cutting-edge technology and unparalleled service quality, fostering 
                growth and innovation in every partnership.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={6}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Our Story
          </Typography>
          <Typography variant="body1" paragraph>
            Founded with a vision to transform how businesses operate, we have grown 
            from a small startup to a trusted partner for companies of all sizes. 
            Our journey has been marked by continuous innovation, customer-centric 
            approach, and commitment to excellence.
          </Typography>
          <Typography variant="body1" paragraph>
            Today, we serve thousands of clients worldwide, helping them achieve 
            their goals through our comprehensive platform and dedicated support team.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AboutPage;