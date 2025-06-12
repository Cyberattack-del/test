require('dotenv').config();
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const { getClientIP } = require('./utils/getClient');
const sendTelegramAlert = require('./utils/telegramAlert');
const getGeoLocation = require('./services/geoLocation');
const getUserAgentDetails = require('./services/userAgent');
const isBot = require('isbot');

const app = express();
app.set('trust proxy', 1);

// Create logs directory and access log stream
if (!fs.existsSync('logs')) fs.mkdirSync('logs');
const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Optional: log visits to a separate file
const visitsLogStream = fs.createWriteStream('./logs/visits.log', { flags: 'a' });

app.get('/', async (req, res) => {
  const ip = getClientIP(req);
  const userAgent = req.headers['user-agent'] || '';
  
  // Detect bots and ignore them
  function isBot(userAgent) {
  if (!userAgent) return false;
  const bots = ['bot', 'crawler', 'spider', 'crawling'];
  const ua = userAgent.toLowerCase();
  return bots.some(bot => ua.includes(bot));
}

// Then in your handler:

  if (isBot(userAgent)) {
    return res.send('🤖 Bot detected. Access logged but no alert sent.');
  }

  // Get geo location info (handles local IPs inside)
  const geo = await getGeoLocation(ip);

  // Get user agent parsed info with fallback
  const uaDetails = getUserAgentDetails(userAgent);

  const referer = req.headers['referer'] || 'Unknown';
  const lang = req.headers['accept-language'] || 'Unknown';

 const message = `🌐 New Visitor Logged
🧠 IP: ${ip}
🏳️ Country: ${geo.flag} ${geo.country}
🏙️ City: ${geo.city} (${geo.postal || '-'})
🗺️ Region: ${geo.region}
🌍 Continent: ${geo.continent || '-'}
⏰ Timezone: ${geo.timezone}
📡 ISP: ${geo.isp}
🏢 Org: ${geo.org}
🔢 ASN: ${geo.asn}
💱 Currency: ${geo.currency}
🛡️ Threat Level: ${geo.threat === 'Proxy/VPN' ? '🕵️ Proxy/VPN' : '✅ Normal'}

📱 Device: ${uaDetails.deviceType} ${uaDetails.device}
🧰 OS: ${uaDetails.os} ${uaDetails.osVersion}
🌐 Browser: ${uaDetails.browser} ${uaDetails.browserVersion}

🔗 Referer: ${referer}
🈯 Language: ${lang}`;


  // Log visit details locally
  visitsLogStream.write(`${new Date().toISOString()} | ${message.replace(/\n/g, ' | ')}\n`);

  // Send Telegram alert
  await sendTelegramAlert(message);

  res.send("✅ IP fully logged successfully!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require('dotenv').config();
// const express = require('express');
// const fs = require('fs');
// const morgan = require('morgan');
// const { getClientIP } = require('./utils/getClient');
// const sendTelegramAlert = require('./utils/telegramAlert');
// const getGeoLocation = require('./services/geoLocation');
// const getUserAgentDetails = require('./services/userAgent');

// const app = express();
// app.set('trust proxy', true);

// if (!fs.existsSync('logs')) fs.mkdirSync('logs');
// const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));

// app.get('/', async (req, res) => {
//   const ip = getClientIP(req);
//   const geo = getGeoLocation(ip);
//   const userAgent = req.headers['user-agent'];
//   const uaDetails = getUserAgentDetails(userAgent);

//   console.log(`IP: ${ip} (${geo.country_name} / ${geo.city})`);
//   console.log(`User-Agent: ${userAgent}`);
//   console.log(`Parsed UA:`, uaDetails);

//   await sendTelegramAlert(
//     `🚨 New Access\nIP:  ${ip}\nCountry: ${geo.country}\nRegion: ${geo.region}\nCity: ${geo.city}\nLat: ${geo.latitude} Long: ${geo.longitude}${ip}\nCountry: ${geo.country_name}\nCity: ${geo.city}\nBrowser: ${uaDetails.browser} ${uaDetails.browserVersion}\nOS: ${uaDetails.os} ${uaDetails.osVersion}`
//   );

//   res.send(`Hello! Your IP is: ${ip} (${geo.country_name} / ${geo.city})`);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // require('dotenv').config();
// // const express = require('express');
// // const { getClientIP } = require('./utils/getClient');
// // const sendTelegramAlert = require('./utils/telegramAlert');
// // const getGeoLocation = require('./services/geoLocation');
// // const fs = require('fs');
// // const morgan = require('morgan');

// // const app = express();
// // app.set('trust proxy', true);

// // if (!fs.existsSync('logs')) fs.mkdirSync('logs');
// // const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
// // app.use(morgan('combined', { stream: accessLogStream }));

// // app.get('/', async (req, res) => {
// //   const ip = getClientIP(req);
// //   const geo = getGeoLocation(ip);

// //   console.log(`Incoming request from IP: ${ip} (${geo.country} / ${geo.city})`);

// //   await sendTelegramAlert(
// //     `🚨 New Access\nIP: ${ip}\nCountry: ${geo.country}\nRegion: ${geo.region}\nCity: ${geo.city}\nLat: ${geo.latitude} Long: ${geo.longitude}
// //  ` );

// //   res.send(`Hello! Your IP is: ${ip} (${geo.country} / ${geo.city})`);
// // });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// // // const express = require('express');
// // // const { getClientIP } = require('./utils/getClient');
// // // const sendTelegramAlert = require('./utils/telegramAlert');
// // // const getGeoLocation = require('./services/geoLocation');
// // // const fs = require('fs');
// // // const morgan = require('morgan');

// // // const app = express();

// // // // ✅ Trust proxy (for railway, vercel, render, etc.)
// // // app.set('trust proxy', true);

// // // // ✅ Create logs folder if not exists
// // // if (!fs.existsSync('logs')) fs.mkdirSync('logs');
// // // const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
// // // app.use(morgan('combined', { stream: accessLogStream }));

// // // app.get('/', async (req, res) => {
// // //   const ip = getClientIP(req);
// // //   const geo = getGeoLocation(ip);

// // //   console.log(`Incoming request from IP: ${ip} (${geo.country} / ${geo.city})`);

// // //   await sendTelegramAlert(
// // //     `🚨 New Access\nIP: ${ip}\nCountry: ${geo.country}\nCity: ${geo.city}`
// // //   );

// // //   res.send(`Hello! Your IP is: ${ip} (${geo.country} / ${geo.city})`);
// // // });

// // // const PORT = process.env.PORT || 3000;
// // // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// // // // require('dotenv').config();
// // // // const express = require('express');
// // // // const { getClientIP } = require('./utils/getClient');
// // // // const sendTelegramAlert = require('./utils/telegramAlert');

// // // // const app = express();

// // // // // Trust proxies (important!)
// // // // app.set('trust proxy', true);

// // // // app.get('/', async (req, res) => {
// // // //   const ip = getClientIP(req);
// // // //   console.log(`Incoming request from IP: ${ip}`);

// // // //   // Send Telegram alert
// // // //   await sendTelegramAlert(`🚨 New Access Detected\nIP: ${ip}`);

// // // //   res.send(`Hello! Your IP is: ${ip}`);
// // // // });

// // // // const PORT = process.env.PORT || 3000;
// // // // app.listen(PORT, () => {
// // // //   console.log(`Server running on port ${PORT}`);
// // // // });