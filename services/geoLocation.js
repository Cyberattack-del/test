// geoLocation.js (in services folder)

const geoip = require('geoip-lite');

function getGeoLocation(ip) {
  const geo = geoip.lookup(ip);
  return {
    country: geo?.country || 'Unknown',
    region: geo?.region || 'Unknown',
    latitude: geo?.ll ? geo.ll[0] : 'Unknown',
    longitude: geo?.ll ? geo.ll[1] : 'Unknown',
    city: geo?.city || 'Unknown'
  };
}

module.exports = getGeoLocation;