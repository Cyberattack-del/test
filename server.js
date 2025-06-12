require('dotenv').config();
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const { getClientIP } = require('./utils/getClient');
const sendTelegramAlert = require('./utils/telegramAlert');
const getGeoLocation = require('./services/geoLocation');
const getUserAgentDetails = require('./services/userAgent');

const app = express();
app.set('trust proxy', true);

if (!fs.existsSync('logs')) fs.mkdirSync('logs');
const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', async (req, res) => {
  const ip = getClientIP(req);
  const geo = getGeoLocation(ip);
  const userAgent = req.headers['user-agent'];
  const uaDetails = getUserAgentDetails(userAgent);

  console.log(`IP: ${ip} (${geo.country_name} / ${geo.city})`);
  console.log(`User-Agent: ${userAgent}`);
  console.log(`Parsed UA:`, uaDetails);

  await sendTelegramAlert(
//         `🚨 New Access\nIP:
//  ` );
    `🚨 New Access\nIP:  ${ip}\nCountry: ${geo.country}\nRegion: ${geo.region}\nCity: ${geo.city}\nLat: ${geo.latitude} Long: ${geo.longitude}${ip}\nCountry: ${geo.country_name}\nCity: ${geo.city}\nBrowser: ${uaDetails.browser} ${uaDetails.browserVersion}\nOS: ${uaDetails.os} ${uaDetails.osVersion}`
  );

  res.send(`Hello! Your IP is: ${ip} (${geo.country_name} / ${geo.city})`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require('dotenv').config();
// const express = require('express');
// const { getClientIP } = require('./utils/getClient');
// const sendTelegramAlert = require('./utils/telegramAlert');
// const getGeoLocation = require('./services/geoLocation');
// const fs = require('fs');
// const morgan = require('morgan');

// const app = express();
// app.set('trust proxy', true);

// if (!fs.existsSync('logs')) fs.mkdirSync('logs');
// const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));

// app.get('/', async (req, res) => {
//   const ip = getClientIP(req);
//   const geo = getGeoLocation(ip);

//   console.log(`Incoming request from IP: ${ip} (${geo.country} / ${geo.city})`);

//   await sendTelegramAlert(
//     `🚨 New Access\nIP: ${ip}\nCountry: ${geo.country}\nRegion: ${geo.region}\nCity: ${geo.city}\nLat: ${geo.latitude} Long: ${geo.longitude}
//  ` );

//   res.send(`Hello! Your IP is: ${ip} (${geo.country} / ${geo.city})`);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// // const express = require('express');
// // const { getClientIP } = require('./utils/getClient');
// // const sendTelegramAlert = require('./utils/telegramAlert');
// // const getGeoLocation = require('./services/geoLocation');
// // const fs = require('fs');
// // const morgan = require('morgan');

// // const app = express();

// // // ✅ Trust proxy (for railway, vercel, render, etc.)
// // app.set('trust proxy', true);

// // // ✅ Create logs folder if not exists
// // if (!fs.existsSync('logs')) fs.mkdirSync('logs');
// // const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
// // app.use(morgan('combined', { stream: accessLogStream }));

// // app.get('/', async (req, res) => {
// //   const ip = getClientIP(req);
// //   const geo = getGeoLocation(ip);

// //   console.log(`Incoming request from IP: ${ip} (${geo.country} / ${geo.city})`);

// //   await sendTelegramAlert(
// //     `🚨 New Access\nIP: ${ip}\nCountry: ${geo.country}\nCity: ${geo.city}`
// //   );

// //   res.send(`Hello! Your IP is: ${ip} (${geo.country} / ${geo.city})`);
// // });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// // // require('dotenv').config();
// // // const express = require('express');
// // // const { getClientIP } = require('./utils/getClient');
// // // const sendTelegramAlert = require('./utils/telegramAlert');

// // // const app = express();

// // // // Trust proxies (important!)
// // // app.set('trust proxy', true);

// // // app.get('/', async (req, res) => {
// // //   const ip = getClientIP(req);
// // //   console.log(`Incoming request from IP: ${ip}`);

// // //   // Send Telegram alert
// // //   await sendTelegramAlert(`🚨 New Access Detected\nIP: ${ip}`);

// // //   res.send(`Hello! Your IP is: ${ip}`);
// // // });

// // // const PORT = process.env.PORT || 3000;
// // // app.listen(PORT, () => {
// // //   console.log(`Server running on port ${PORT}`);
// // // });