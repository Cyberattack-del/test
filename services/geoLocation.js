const geoip = require('geoip-lite');

function getGeoLocation(ip) {
  const geo = geoip.lookup(ip);
  return {
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown'
  };
}

module.exports = getGeoLocation;