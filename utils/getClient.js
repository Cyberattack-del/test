// function getClientIP(req) {
//   const forwarded = req.headers['x-forwarded-for'];
//   const ip =
//     req.headers['cf-connecting-ip'] || // Cloudflare
//     (forwarded ? forwarded.split(',')[0].trim() : null) ||
//     req.connection?.remoteAddress ||
//     req.socket?.remoteAddress ||
//     req.ip || 'Unknown';

//   return normalizeIP(ip);
// }

// function normalizeIP(ip) {
//   if (!ip) return 'Unknown';
//   if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
//   if (ip === '::1') ip = '127.0.0.1';
//   return ip;
// }

// module.exports = { getClientIP };
// utils/getClient.js

function isPrivateIP(ip) {
  return /^127\./.test(ip) || // localhost
         /^10\./.test(ip) ||
         /^192\.168\./.test(ip) ||
         /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
         /^::1$/.test(ip) ||
         /^fc00:/i.test(ip) || // IPv6 private
         /^fe80:/i.test(ip);   // IPv6 link-local
}

function getClientIP(req) {
  // Check Cloudflare header first (if using CF)
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'];
  }

  // X-Forwarded-For can have multiple IPs: first is original client
  if (req.headers['x-forwarded-for']) {
    const ips = req.headers['x-forwarded-for'].split(',').map(ip => ip.trim());
    // Return the first public IP (skip private IPs if possible)
    for (const ip of ips) {
      if (!isPrivateIP(ip)) return ip;
    }
    // If all private, return first
    return ips[0];
  }

  // Fallback to x-real-ip header
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }

  // Fallback to connection remote address
  let ip = req.connection?.remoteAddress || req.socket?.remoteAddress || req.ip;

  if (!ip) return 'Unknown';

  // Remove IPv6 prefix if present
  if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

  if (ip === '::1') ip = '127.0.0.1';

  return ip;
}

module.exports = { getClientIP };

