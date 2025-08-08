import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  TextField, 
  Button,
  Alert
} from '@mui/material';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <Container maxWidth="lg">
      <Box py={8}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Contact Us
        </Typography>
        
        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Get in Touch
              </Typography>
              
              {showSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! We'll get back to you soon.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Contact Information
              </Typography>
              
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1">
                  123 Business Street<br />
                  Suite 100<br />
                  City, State 12345
                </Typography>
              </Box>
              
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1">
                  contact@example.com
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" gutterBottom>
                  Business Hours
                </Typography>
                <Typography variant="body1">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ContactPage;
