// lib/redisClient.js
import Redis from 'ioredis';

const redisClient = new Redis({
  port: 6379,
  host: 'localhost',
  password: '684foxtower' // replace with your password
});

const myRedis = {
    ...redisClient,
    /**
     * redis에 처음 저장한다
     * @param {*} key 저장하고자 하는 key값 
     * @param {*} value  
     * @returns 
     */
    set: async (key, value) => {
        try {
            return await redisClient.set(key, value);
        } catch (error) {
            console.error(`Error setting value for key: ${key}`, error);

        }
    },
    /**
     * Redis의 리스트에 값(value)을 왼쪽(L)으로 추가하는 함수
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    lpush: async (key, value) => {
        try {
            return await redisClient.lpush(key, value);
        } catch (error) {
            console.error(`Error setting value for key: ${key}`, error);

        }
    },
   // 지정된 패턴(key)에 해당하는 Redis 키를 검색하는 함수
    getKeyArray : async (key='*') => {
        try {
            console.log('getKeyArray',key)
            return await redisClient.keys(key);
        } catch(E){
            console.log('getkeyError',E)
            return [];
        }
    },
    //keyArray의 각 요소에 대해 데이터를 가져와 values 객체에 저장하는 함수
    
    getData: async (keyArray) => {
        const values = {};
        console.log('startGetData',keyArray)
        for (const key of keyArray) {
            try {
               console.log('get', key);
               
              values[key] =  await redisClient.lrange(key, 0, -1);
              
            } catch (e) {
              console.log(key,e);
              values[key] = 'errorIndex';
            }
          }
        return  values;
    },
  };

export default myRedis;