import RedisPkg from 'ioredis';
const Redis = (RedisPkg as any).default || RedisPkg;

import { logger } from './logger.js';

const redisConfig = {
  host: 'redis-12450.c341.af-south-1-1.ec2.cloud.redislabs.com',
  port: 12450,
  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(redisConfig);

redisConnection.on('error', (error: Error) => {
  logger.error('Redis connection error:', error);
});

redisConnection.on('connect', () => {
  logger.info('Connected to Redis');
});
