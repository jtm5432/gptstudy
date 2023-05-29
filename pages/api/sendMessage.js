import { WebClient } from '@slack/web-api';

import ChatGPT from './chatgpttalk';

// Now you can use the redis client

//const SLACK_TOKEN = "xoxb-5184867461028-5285393446566-EmZulmSSO7Cc2K5mxallqHlm";
const token = process.env.SLACK_TOKEN || "xoxb-5184867461028-5285393446566-EmZulmSSO7Cc2K5mxallqHlm";

const web = new WebClient(token);

export default async function handler(req, res) {
  if (req.method === 'POST') {    const payload = req.body

    if (payload.type === 'url_verification') {
      // Respond with the challenge token
      res.status(200).json({ 'challenge': payload.challenge });
      } 
    else if (payload.event && payload.event.type === 'message' ) {
       // Handle the message.channels event
      const message = payload.event.text;
     // console.log('meesageis',message);
      //chatbot에서 나오는 응답은 무시
      if(message.indexOf("gpt said")!==-1) return ;
      const chatGpt = new ChatGPT();
      // You can customize your bot's response here
      try {
        let response='gpt said';
        chatGpt.sendMessage(message).then(
          async (gptmsg) => await web.chat.postMessage({ text: `${response} ${gptmsg}`, channel: "C05944YUWTB" })
        );
      }
      catch (e){
       console.log('erroris',e)

      }
      res.status(200).json({ status: 'ok' });
    }
   } else {
    console.log("testtest");
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
