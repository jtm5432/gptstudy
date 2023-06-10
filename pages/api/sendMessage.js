import { WebClient } from '@slack/web-api';
import ChatGPT from './chatgpttalk';

const token = process.env.SLACK_TOKEN || "xoxb-5184867461028-5285393446566-EmZulmSSO7Cc2K5mxallqHlm";
const web = new WebClient(token);

let seenEventIds = new Set();
const botUserId = 'U058DBKD4GN';
const responsePrefix = 'gpt said';
const channelId = 'C05944YUWTB';
const chatGpt = new ChatGPT();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const payload = req.body;

  if (payload.type === 'url_verification') {
    return res.status(200).json({ 'challenge': payload.challenge });
  }

  if (payload.event && payload.event.type === 'message' && payload.event.user !== botUserId) {
    if (messageIncludesResponsePrefix(payload.event.text) || isDuplicateEvent(payload.event_id)) {
      return res.status(200).end();
    }

    try {
      const gptMessage = await chatGpt.sendMessage(payload.event.text);
      await web.chat.postMessage({ text: `${responsePrefix} ${gptMessage}`, channel: channelId });
    } catch (e) {
      console.error('Error in chatGpt.sendMessage or web.chat.postMessage:', e);
    }

    return res.status(200).json({ status: 'ok' });
  }

  console.log("Unhandled case in POST request");
  return res.status(200).end();
}

function messageIncludesResponsePrefix(message) {
  return message.indexOf(responsePrefix) !== -1;
}

function isDuplicateEvent(eventId) {
  if (seenEventIds.has(eventId)) {
    console.log(`Ignoring duplicate event ${eventId}`);
    return true;
  }

  seenEventIds.add(eventId);
  return false;
}
