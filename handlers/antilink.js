const { cmd } = require('../command');
const config = require("../config");

cmd({
  on: "body" // Listens to all messages
}, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!global.warnings) global.warnings = {};
    if (!isGroup || isAdmins || !isBotAdmins || config.ANTI_LINK !== 'true') return;

    const linkPatterns = [
      /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
      // ... (your other patterns)
    ];

    if (linkPatterns.some(pattern => pattern.test(body))) {
      try {
        await conn.sendMessage(from, { delete: m.key });
      } catch (e) { console.log("Failed to delete:", e); }

      global.warnings[sender] = (global.warnings[sender] || 0) + 1;
      
      if (global.warnings[sender] >= 3) {
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        delete global.warnings[sender];
      } else {
        await conn.sendMessage(from, {
          text: `⚠️ *Warning ${global.warnings[sender]}/3*\n@${sender.split('@')[0]}, links are not allowed!`,
          mentions: [sender]
        });
      }
    }
  } catch (error) {
    console.error("Anti-link error:", error);
  }
});