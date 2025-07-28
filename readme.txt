// Backend: Express Microservice (server.js)
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

const urlDatabase = {};
const clickStats = {};

const generateShortcode = () => uuidv4().slice(0, 6);

app.post('/shorturls', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== 'string' || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  let code = shortcode || generateShortcode();
  if (shortcode && urlDatabase[code]) {
    return res.status(409).json({ error: 'Shortcode already in use' });
  }

  const expiry = new Date(Date.now() + validity * 60000).toISOString();
  urlDatabase[code] = { url, expiry, createdAt: new Date().toISOString() };
  clickStats[code] = [];

  res.status(201).json({ shortLink: `http://localhost:5000/${code}`, expiry });
});

app.get('/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const record = urlDatabase[code];
  if (!record) return res.status(404).json({ error: 'Shortcode not found' });

  if (new Date() > new Date(record.expiry)) {
    return res.status(410).json({ error: 'Link has expired' });
  }

  clickStats[code].push({
    timestamp: new Date().toISOString(),
    referrer: req.get('Referrer') || 'direct',
    location: req.ip
  });

  res.redirect(record.url);
});

app.get('/shorturls/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const record = urlDatabase[code];
  if (!record) return res.status(404).json({ error: 'Shortcode not found' });

  res.json({
    url: record.url,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: clickStats[code].length,
    clicks: clickStats[code]
  });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));

// Frontend: React App (App.js)
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const App = () => {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async () => {
    const promises = urls.map(data => axios.post('http://localhost:5000/shorturls', data));
    const responses = await Promise.all(promises);
    setResults(responses.map(r => r.data));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {urls.map((input, index) => (
        <Box key={index} mb={2}>
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
            margin="dense"
            value={input.validity}
            onChange={(e) => handleChange(index, 'validity', e.target.value)}
          />
          <TextField
            label="Preferred Shortcode"
            margin="dense"
            value={input.shortcode}
            onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
          />
        </Box>
      ))}
      <Button variant="contained" onClick={handleSubmit}>Shorten URLs</Button>

      {results.map((r, idx) => (
        <Box key={idx} mt={2}>
          <Typography>Short Link: <a href={r.shortLink} target="_blank" rel="noreferrer">{r.shortLink}</a></Typography>
          <Typography>Expires At: {r.expiry}</Typography>
        </Box>
      ))}
    </Container>
  );
};

export default App;






const fetch = require("node-fetch");

async function logEvent(stack, level, pkg, message) {
  const accessToken = "YOUR_ACCESS_TOKEN_HERE"; // Token from Step 2

  const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      stack,
      level,
      package: pkg,
      message
    })
  });

  const data = await response.json();
  console.log("Logging Server Reply:", data);
}

module.exports = logEvent;
Then use it in your route like:

js
Copy
Edit
const logEvent = require("./logger");

app.get("/test", (req, res) => {
  logEvent("backend", "info", "route", "Test endpoint was hit");
  res.send("Test Successful");
});


// Paste this once in a common utils.js or helper file
async function Log(stack, level, pkg, message) {
  const accessToken = "YOUR_ACCESS_TOKEN_HERE";  // Replace with your token

  const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      stack: stack,
      level: level,
      package: pkg,
      message: message
    })
  });

  const data = await response.json();
  console.log("Server replied:", data);
}
