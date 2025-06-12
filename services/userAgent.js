const UAParser = require('ua-parser-js');

function getUserAgentDetails(userAgentString) {
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  return {
    browser: result.browser.name || 'Unknown',
    browserVersion: result.browser.version || 'Unknown',
    os: result.os.name || 'Unknown',
    osVersion: result.os.version || 'Unknown',
    device: result.device.model || 'Desktop',
    deviceType: result.device.type || 'Computer',
    engine: result.engine.name || 'Unknown'
  };
}

module.exports = getUserAgentDetails;