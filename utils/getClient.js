function getClientIP(req) {
  const ip = req.headers['cf-connecting-ip'] ||
             (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : null) ||
             req.connection?.remoteAddress ||
             req.socket?.remoteAddress ||
             req.ip || 'Unknown';

  return normalizeIP(ip);
}

function normalizeIP(ip) {
  if (!ip) return 'Unknown';
  if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
  if (ip === '::1') ip = '127.0.0.1';
  return ip;
}

module.exports = { getClientIP };