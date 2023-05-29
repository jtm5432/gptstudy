import axios from 'axios';

const clientId = '9ODw567OMMIER7OebaLh';
const clientSecret = 'uwDRDfYKRL';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Naver-Client-Id': clientId,
  'X-Naver-Client-Secret': clientSecret
};




const PPGtranse = (SetLanguage) => {
    let textToTranslate = 'Your text to translate';
    const targetLanguage = SetLanguage; // Target language code, e.g., 'en' for English
    const apiUrl = 'https://openapi.naver.com/v1/papago/n2mt';
    const getrequestBody = (text) => `source=auto&target=${targetLanguage}&text=${encodeURIComponent(text)}`;
    const getTranslate =
     async (text) => await axios.post(apiUrl, getrequestBody(text), { headers })
      .then((response) =>  response.data.message.result.translatedText);
   

    return {getTranslate }
}

export default PPGtranse;