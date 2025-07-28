// server.js
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/shorturls', (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Simulate short link creation
  const randomCode = shortcode || Math.random().toString(36).substr(2, 6);
  const shortLink = `http://short.ly/${randomCode}`;
  const expiry = new Date(Date.now() + (validity || 60) * 60000); // default 60 min

  res.json({
    shortLink,
    expiry: expiry.toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
