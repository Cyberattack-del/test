const fetch = require('node-fetch');

async function getGeoLocation(ip) {
  // Handle localhost and private IPs gracefully
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return {
      ip,
      country: 'Localhost',
      city: 'Local',
      postal: '-',
      region: '-',
      continent: '-',
      timezone: '-',
      isp: '-',
      org: '-',
      asn: '-',
      currency: '-',
      flag: '💻',
      threat: 'Local'
    };
  }

  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    const data = await res.json();

    if (!data.success) {
      throw new Error('IP lookup failed');
    }

    return {
      ip: data.ip,
      country: data.country,
      city: data.city || 'Unknown',
      postal: data.postal || '-',
      region: data.region || 'Unknown',
      continent: data.continent || '-',
      timezone: data.timezone?.id || 'Unknown',
      isp: data.connection?.isp || 'Unknown',
      org: data.connection?.org || 'Unknown',
      asn: data.connection?.asn || 'Unknown',
      currency: data.currency?.code || 'Unknown',
      flag: data.flag?.emoji || '🏳️',
      threat: data.security?.is_proxy ? 'Proxy/VPN' : 'Normal'
    };
  } catch (error) {
    console.error('GeoLocation Error:', error);
    return {
      country: 'Unknown',
      city: 'Unknown',
      postal: '-',
      region: 'Unknown',
      continent: '-',
      timezone: 'Unknown',
      isp: 'Unknown',
      org: 'Unknown',
      asn: 'Unknown',
      currency: 'Unknown',
      flag: '🏳️',
      threat: 'Unknown'
    };
  }
}

module.exports = getGeoLocation;
