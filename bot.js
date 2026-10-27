
'use strict';

/**
 * Telegram pairing interface for the existing Baileys project.
 *
 * Required:
 * TELEGRAM_BOT_TOKEN
 *
 * Optional:
 * TELEGRAM_OWNER_ID
 */

const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const startpairing = require('./pair');

const token = process.env.TELEGRAM_BOT_TOKEN;
const ownerId = process.env.TELEGRAM_OWNER_ID
  ? String(process.env.TELEGRAM_OWNER_ID)
  : null;

const pairingFile = path.join(
  __dirname,
  'kingbadboitimewisher',
  'pairing',
  'pairing.json'
);

if (!token) {
  console.error(
    'Missing TELEGRAM_BOT_TOKEN. Set it before starting bot.js.'
  );
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const waitingForNumber = new Set();
const busyChats = new Set();

function isAllowed(msg) {
  return !ownerId || String(msg.from?.id) === ownerId;
}

function normalizePhoneNumber(input) {
  return String(input || '').replace(/[^\d]/g, '');
}

function isPlausiblePhoneNumber(number) {
  return /^\d{8,15}$/.test(number);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForPairingCode(
  number,
  previousTimestamp,
  timeoutMs = 25000
) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      if (fs.existsSync(pairingFile)) {
        const data = JSON.parse(
          fs.readFileSync(pairingFile, 'utf8')
        );

        const fresh =
          data &&
          String(data.number || '').replace(/[^\d]/g, '') === number &&
          data.code &&
          data.timestamp &&
          data.timestamp !== previousTimestamp;

        if (fresh) return data.code;
      }
    } catch (error) {
      // Retry if the file is temporarily unreadable.
    }

    await sleep(500);
  }

  return null;
}

bot.onText(/^\/start(?:@\w+)?$/, async msg => {
  if (!isAllowed(msg)) {
    return bot.sendMessage(msg.chat.id, 'Access denied.');
  }

  return bot.sendMessage(
    msg.chat.id,
    [
      '👋 WhatsApp MD Bot Pairing',
      '',
      'Use /pair to start pairing your own WhatsApp number.',
      'Enter your number with country code, digits only.',
      'Example: 923001234567',
      '',
      'Approve device linking yourself in WhatsApp.',
      'Use /cancel to cancel.'
    ].join('\n')
  );
});

bot.onText(/^\/pair(?:@\w+)?$/, async msg => {
  if (!isAllowed(msg)) {
    return bot.sendMessage(msg.chat.id, 'Access denied.');
  }

  if (busyChats.has(msg.chat.id)) {
    return bot.sendMessage(
      msg.chat.id,
      'A pairing request is already in progress. Please wait.'
    );
  }

  waitingForNumber.add(msg.chat.id);

  return bot.sendMessage(
    msg.chat.id,
    'Send your own WhatsApp number with country code, digits only. Example: 923001234567\n\nUse /cancel to cancel.'
  );
});

bot.onText(/^\/cancel(?:@\w+)?$/, async msg => {
  waitingForNumber.delete(msg.chat.id);
  return bot.sendMessage(msg.chat.id, 'Cancelled.');
});

bot.on('message', async msg => {
  if (!msg.text || msg.text.startsWith('/')) return;
  if (!isAllowed(msg)) return;
  if (!waitingForNumber.has(msg.chat.id)) return;

  const chatId = msg.chat.id;
  const number = normalizePhoneNumber(msg.text);

  if (!isPlausiblePhoneNumber(number)) {
    return bot.sendMessage(
      chatId,
      'Invalid number. Send 8–15 digits with country code, or use /cancel.'
    );
  }

  waitingForNumber.delete(chatId);
  busyChats.add(chatId);

  try {
    let previousTimestamp = null;

    try {
      if (fs.existsSync(pairingFile)) {
        const oldData = JSON.parse(
          fs.readFileSync(pairingFile, 'utf8')
        );
        previousTimestamp = oldData.timestamp || null;
      }
    } catch (_) {
      // Ignore previous result if unreadable.
    }

    await bot.sendMessage(
      chatId,
      `Starting pairing for +${number}…\n\nOnly continue if this is your own WhatsApp account.`
    );

    await startpairing(number);

    const code = await waitForPairingCode(
      number,
      previousTimestamp
    );

    if (!code) {
      return bot.sendMessage(
        chatId,
        'Could not retrieve a new pairing code in time. Check the Node.js console for errors, then try /pair again.'
      );
    }

    return bot.sendMessage(
      chatId,
      `🔐 WhatsApp pairing code for +${number}:\n\n${code}\n\nOpen WhatsApp → Linked devices → Link a device, then follow WhatsApp's pairing-code instructions. Do not share this code with anyone.`
    );
  } catch (error) {
    console.error('Telegram pairing error:', error);

    return bot.sendMessage(
      chatId,
      `Pairing failed: ${error.message || 'Unknown error'}\nCheck the Node.js console for details.`
    );
  } finally {
    busyChats.delete(chatId);
  }
});

bot.on('polling_error', error => {
  console.error('Telegram polling error:', error.message);
});

bot.on('error', error => {
  console.error('Telegram bot error:', error.message);
});

console.log('Telegram pairing bot started.');
