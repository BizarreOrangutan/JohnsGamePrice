import { createClient } from 'redis';

const REDIS_OFF = process.env.REDIS_OFF === 'true';

let redisClient: any;

if (!REDIS_OFF) {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPassword = process.env.REDIS_PASSWORD || '';
  const redisUrl = redisPassword
    ? `redis://default:${redisPassword}@${redisHost}:6379`
    : `redis://default@${redisHost}:6379`;

  redisClient = createClient({ url: redisUrl });

  redisClient.on('error', (err: any) => {
    console.error('Redis Client Error', err);
  });

  // Retry logic
  const MAX_RETRIES = 10;
  const RETRY_DELAY_MS = 2000;

  async function connectWithRetry(retries = 0) {
    try {
      await redisClient.connect();
      console.log('Connected to Redis');
    } catch (err) {
      if (retries < MAX_RETRIES) {
        console.warn(`Redis connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => connectWithRetry(retries + 1), RETRY_DELAY_MS);
      } else {
        console.error('Max Redis connection retries reached. Exiting.');
        process.exit(1);
      }
    }
  }

  connectWithRetry();
} else {
  // Dummy client for local/dev when REDIS_OFF is true
  redisClient = {
    async get() { return null; },
    async setEx() { return; }
  };
}

export { redisClient };