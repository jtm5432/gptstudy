// lib/redisClient.js
import Redis from 'ioredis';

const redisClient = new Redis({
  port: 6379,
  host: 'localhost',
  password: '684foxtower' // replace with your password
});

const myRedis = {
    ...redisClient,
    set: async (key, value) => {
        try {
            return await redisClient.set(key, value);
        } catch (error) {
            console.error(`Error setting value for key: ${key}`, error);

        }
    },
    lpush: async (key, value) => {
        try {
            return await redisClient.lpush(key, value);
        } catch (error) {
            console.error(`Error setting value for key: ${key}`, error);

        }
    },
    getKeyArray : async (key='*') => {
        try {
            return await redisClient.keys(key);
        } catch(E){
            console.log('getkeyError',E)
            return [];
        }
    },
    getData: async (keyArray) => {
        const values = {};
        keyArray.reduce(async (Acc,cv) =>{
            try{   
                return Acc.cv = await redisClient.get(cv)
            } catch(e){
                return Acc.cv = 'errorIndex';
            }} ,values)    
    },
  };

export default myRedis;