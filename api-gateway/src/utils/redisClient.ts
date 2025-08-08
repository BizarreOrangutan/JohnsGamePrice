import { createClient } from 'redis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPassword = process.env.REDIS_PASSWORD || '';
const redisUrl = redisPassword
  ? `redis://default:${redisPassword}@${redisHost}:6379`
  : `redis://default@${redisHost}:6379`;

export const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect().catch(console.error);