import myRedis from './lib/redisClient.js';

export default async function handler(req, res) {
    try {
      const result = await myRedis.getKeyArray('*');
      console.log('res', result);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error retrieving data from Redis:', error);
      res.status(500).json([]);
    }
  }