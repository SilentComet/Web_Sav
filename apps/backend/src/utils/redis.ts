import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Default to localhost for dev if not specified
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL);

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis Error:', err);
});

export default redis;
