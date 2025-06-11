require('dotenv').config();
const express = require('express');
const { getClientIP } = require('./utils/getClient');
const sendTelegramAlert = require('./utils/telegramAlert');

const app = express();

// Trust proxies (important!)
app.set('trust proxy', true);

app.get('/', async (req, res) => {
  const ip = getClientIP(req);
  console.log(`Incoming request from IP: ${ip}`);

  // Send Telegram alert
  await sendTelegramAlert(`🚨 New Access Detected\nIP: ${ip}`);

  res.send(`Hello! Your IP is: ${ip}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});