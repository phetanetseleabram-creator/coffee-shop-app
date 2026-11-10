import Redis from 'ioredis';
import 'dotenv/config';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not set');
}

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  tls: process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (e) => console.error('Redis error:', e.message));

export default redis;