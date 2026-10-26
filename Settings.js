const fs = require('fs');
const SETTINGS_PATH = './setting.json';

let settings = {};
try {
  if (fs.existsSync(SETTINGS_PATH)) {
    settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8') || '{}');
  } else {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify({}, null, 2));
    settings = {};
  }
} catch (e) {
  console.error('Failed to load settings.json', e);
  settings = {};
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

/**
 * Get a setting for a user, group, or bot.
 * @param {string} jid - User JID, group JID, or 'bot' for global bot settings
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if key doesn't exist
 */
function getSetting(jid, key, defaultValue = false) {
  if (!settings[jid]) return defaultValue;
  return settings[jid][key] !== undefined ? settings[jid][key] : defaultValue;
}

/**
 * Set a setting for a user, group, or bot.
 * @param {string} jid - User JID, group JID, or 'bot' for global bot settings
 * @param {string} key - Setting key
 * @param {*} value - Value to save
 */
function setSetting(jid, key, value) {
  if (!settings[jid]) settings[jid] = {};
  settings[jid][key] = value;
  saveSettings();
}

module.exports = { getSetting, setSetting };

