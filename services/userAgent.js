const UAParser = require('ua-parser-js');

function getUserAgentDetails(userAgent) {
  if (!userAgent) {
    return {
      deviceType: 'Unknown',
      device: 'Unknown',
      os: 'Unknown',
      osVersion: '',
      browser: 'Unknown',
      browserVersion: ''
    };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    deviceType: result.device?.type || 'Desktop',
    device: result.device?.model || 'Unknown',
    os: result.os?.name || 'Unknown',
    osVersion: result.os?.version || '',
    browser: result.browser?.name || 'Unknown',
    browserVersion: result.browser?.version || '',
  };
}

module.exports = getUserAgentDetails;
