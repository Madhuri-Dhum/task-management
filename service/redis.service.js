const Redis = require('ioredis');
const CACHE_TTL = 3600;
const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: `${process.env.REDIS_HOST}`,
    password: `${process.env.REDIS_PASSWORD}`,
    tls: {
        rejectUnauthorized: false,
    },
});
const CACHE_KEY = "tasks";
const CACHE_KEY_USER = "user";

const cacheData = async (key, data) => {
    try {
        console.log('Caching data:', key, data);
        const jsonData = JSON.stringify(data);
        await redis.setex(key, CACHE_TTL, jsonData);
    } catch (error) {
        console.error('Error caching data:', error);
        throw error;
    }
};

const getCachedData = async (key) => {
    try {
        const cachedData = await redis.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
        console.error(`Error getting cached data for key ${key}:`, error);
        throw error;
    }
};

const invalidateCache = async (key) => {
    try {
        await redis.del(key);
    } catch (error) {
        console.error('Error invalidating cache:', error);
        throw error;
    }
};

setInterval(async () => {
    await invalidateCache(CACHE_KEY);
}, 5 * 60 * 1000);

setInterval(async () => {
    await invalidateCache(CACHE_KEY_USER);
}, 5 * 60 * 1000);

module.exports = {
    cacheData,
    getCachedDataUser: () => getCachedData(CACHE_KEY_USER),
    getCachedDataTask: () => getCachedData(CACHE_KEY),
    invalidateCache,
};
