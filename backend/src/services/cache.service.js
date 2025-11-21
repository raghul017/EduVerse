import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 10 });

export const cacheService = {
  get: (key) => cache.get(key),
  set: (key, value, ttl) => cache.set(key, value, ttl),
  del: (key) => cache.del(key)
};
