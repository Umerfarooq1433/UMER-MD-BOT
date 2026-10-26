const { cmd } = require('../command');
const config = require("../config");

cmd({
  pattern: "antilink",
  desc: "Enable/disable anti-link protection",
  category: "group",
  fromMe: true, // or isBotAdmins: true
  use: '<on/off>'
}, async (m, match) => {
  if (!m.isGroup) return m.reply("❌ This command only works in groups!");
  
  const action = match[1]?.toLowerCase();
  
  if (action === 'on') {
    config.ANTI_LINK = 'true';
    await m.reply("✅ *Anti-link enabled!* Links will now be auto-deleted 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ᑌᗰEᖇ ᗰᗪ ᗷOT.");
  } 
  else if (action === 'off') {
    config.ANTI_LINK = 'false';
    await m.reply("❌ *Anti-link disabled!* Links are now allowed 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ᑌᗰEᖇ ᗰᗪ ᗷOT.");
  } 
  else {
    await m.reply(`🔍 Anti-link status: *${config.ANTI_LINK === 'true' ? 'ENABLED' : 'DISABLED'}*\n\nUsage: *.antilink on* or *.antilink off*`);
  }
});