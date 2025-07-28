import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from '@mui/material';

const App = () => {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
  };

  const handleSubmit = async () => {
    // Basic validation
    for (let i = 0; i < urls.length; i++) {
      if (!urls[i].url.trim()) {
        alert(`URL at row ${i + 1} is empty`);
        return;
      }
    }

    setLoading(true);
    try {
      const promises = urls.map((data) =>
        axios.post('http://localhost:5000/shorturls', data)
      );
      const responses = await Promise.all(promises);
      setResults(responses.map((r) => r.data));
      setUrls([{ url: '', validity: '', shortcode: '' }]); // reset form
    } catch (error) {
      console.error('Error during shortening:', error);
      alert('An error occurred while shortening URLs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        URL Shortener
      </Typography>

      {urls.map((input, index) => (
        <Box
          key={index}
          mb={2}
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
        >
          <TextField
            label="Long URL"
            fullWidth
            margin="dense"
            value={input.url}
            onChange={(e) => handleChange(index, 'url', e.target.value)}
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            fullWidth
            margin="dense"
            value={input.validity}
            onChange={(e) => handleChange(index, 'validity', e.target.value)}
          />
          <TextField
            label="Preferred Shortcode"
            fullWidth
            margin="dense"
            value={input.shortcode}
            onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
          />
        </Box>
      ))}

      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <Button fullWidth variant="outlined" onClick={addUrlField}>
            Add Another
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Shorten URLs'}
          </Button>
        </Grid>
      </Grid>

      {results.map((r, idx) => (
        <Box key={idx} mt={2} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography>
            Short Link:{' '}
            <a href={r.shortLink} target="_blank" rel="noreferrer">
              {r.shortLink}
            </a>
          </Typography>
          <Typography>Expires At: {r.expiry}</Typography>
        </Box>
      ))}
    </Container>
  );
};

export default App;
