import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://redis:6379";

class RedisService {
  private client: Redis | null = null;

  public getClient(): Redis {
    if (!this.client) {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.client.on("error", (err) => {
        console.error("[Redis] Connection Error:", err.message);
      });

      this.client.on("connect", () => {
        console.log("[Redis] Connected successfully to", redisUrl);
      });
    }
    return this.client;
  }

  public async get(key: string): Promise<string | null> {
    try {
      const client = this.getClient();
      return await client.get(key);
    } catch (err) {
      console.warn("[Redis] Get failed for key:", key, err);
      return null;
    }
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      const client = this.getClient();
      if (ttlSeconds) {
        await client.set(key, value, "EX", ttlSeconds);
      } else {
        await client.set(key, value);
      }
    } catch (err) {
      console.warn("[Redis] Set failed for key:", key, err);
    }
  }

  public async del(key: string): Promise<void> {
    try {
      const client = this.getClient();
      await client.del(key);
    } catch (err) {
      console.warn("[Redis] Del failed for key:", key, err);
    }
  }
}

export const redisService = new RedisService();
export const redisClient = redisService;
