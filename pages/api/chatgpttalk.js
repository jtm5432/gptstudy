
const { Configuration, OpenAIApi } = require('openai');
import myRedis from './lib/redisClient.js';
import fireBase from './lib/fireBase.js';
import PPGtranse from './lib/papagoTrans.js';

/**
 * 입력 받은 msg를 ChatGpt에 물어봄. 
 * 물어볼땐 영어로 , 답변을 영어로 받으면 그걸 한글로 번역함
 * 나온 답변을 키값과 함께 redis에 저장
 * @returns 
 */


export default function ChatGPT() {
  // Function to send a message and receive a response from ChatGPT
  const configuration = new Configuration({
    apiKey: "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",
  });
  
  const openai = new OpenAIApi(configuration);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured',
      },
    });
    return;
  }
  
  const response = async (question) => await openai.createCompletion({
    model: 'text-davinci-003',
    //prompt: `I am a highly intelligent question answering bot. If you ask me ${question} that is rooted in truth, I will give you the answer to Korean. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"잘 모르겠습니다.\".\n`,
    prompt: `${question}`,
    temperature :0.5,
    max_tokens : 1000
    // prompt가 너무 길어서 생략

  });
  /**
   * papago 번역 api msg를 영어로 번역. 
   * msg가 Language에서 설정한것과 같은 언어면 에러 발생하여 기존 msg를 리턴.
   */
  function setTranseLan(Language){
    let transEng = PPGtranse(Language);
    
    async function getTrans(msg) {
      try {
      return await transEng.getTranslate(msg);
      }
      catch (E){
        return msg;
      }
    }

    return {getTrans}
  }
  /**
   * message를 openai gpt에 보내고 응답받는다.
   */
  async function sendMessage(message) {
    // Send the message to ChatGPT and receive the response
 
    console.log('messageis',message)
    let transMessage = await setTranseLan('en').getTrans(message);
    
    let apiAnswer; //gpt 응답
    let keyWordAnswer; //gpt한테 물어볼 키워드 응답
    //gpt에 msg를 보내고 응답을 받는다. 
    
    /* 오답노트 . chatgpt는 무조건 choice[0].text 한줄로 나온다. 중간에 끊긴건 maxtoken값을 낮게 줘서
    const gptAnswer = (msg) => response(msg)
      .then((response) => response.data.choices[0].reduce((acc,cv) => {
       console.log(cv);
        return acc+"\n"+cv.content
      },''));
      */
      const gptAnswer = (msg) => response(msg)
      .then((response) => response.data.choices[0].text);

    try {
      //apiAnswer = await gptAnswer(transMessage);
      //keyWordAnswer = await gptAnswer('Summarize in one word what I asked before');
      [apiAnswer, keyWordAnswer] = await Promise.all([gptAnswer(transMessage), gptAnswer(`Tell me the keyword of the "${transMessage}" in one word`)]);
    }catch  (error) {
      console.error('Error:', error);
      return "GptError";
    }
    
    //console.log('keyword',keyWordAnswer,'message',apiAnswer)
    let KorApiAnswer = await setTranseLan('ko').getTrans(apiAnswer);
    keyWordAnswer = keyWordAnswer.replace(/\n/g, '').replace(/<[^>]+>|"/g, '');
    const saveAnswer = message + '\n' + KorApiAnswer; //redis에 저장되는 질문+ 답변 한글 응답
    //console.log('transmessageis',KorApiAnswer)
    sendRedis(keyWordAnswer);
    sendFireBase(keyWordAnswer,saveAnswer);
    return KorApiAnswer;
  }
    /**
     * key : redis에 저장되는 key값
     * textvalue : 저장되는 string
     */
  function sendRedis(key,textvalue){
   return new Promise( (resolve,reject) => {
    
    return myRedis.lpush(key, textvalue).then(result => {
      if (typeof result === 'number') {
          console.log('Set operation was successful',result,key);
          resolve(result);
        } else {
          console.log('Set operation was not successful',result);
          reject(result);
        }
      }).catch(error => {
        console.error('An error occurred during the set operation', error);
        reject(error);
      });
    }).catch((error) => {
      console.error('Unhandled promise rejection', error);
    });
  }
  function sendFireBase(key,textvalue){
    fireBase.setCollection(key);
    let GetTIME = Date.now().toString();
    console.log('GetTIME',GetTIME)
    return new Promise( (resolve,reject) => {
      return fireBase.saveData(GetTIME,textvalue).then(result => {
        console.log('User data saved successfully',result)
        resolve();
      }).catch(error => reject());
    });

  }
  return {
    sendMessage: sendMessage
  }

};