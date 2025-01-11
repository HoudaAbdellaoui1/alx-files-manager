const redis = require("redis");
const { promisify } = require("util");

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Log any errors with the Redis client
    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    // Promisify Redis client methods for easier async/await usage
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Checks if Redis client is connected
   * @returns {boolean} true if connected, otherwise false
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value associated with a key
   * @param {string} key - The key to retrieve the value for
   * @returns {Promise<string | null>} The value associated with the key or null if not found
   */
  async get(key) {
    try {
      return await this.getAsync(key);
    } catch (err) {
      console.error("Error getting key from Redis:", err);
      return null;
    }
  }

  /**
   * Sets a value in Redis with a key and expiration
   * @param {string} key - The key to set
   * @param {string} value - The value to set
   * @param {number} duration - The expiration duration in seconds
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    try {
      await this.setAsync(key, value, "EX", duration);
    } catch (err) {
      console.error("Error setting key in Redis:", err);
    }
  }

  /**
   * Deletes a value from Redis by its key
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   */
  async del(key) {
    try {
      await this.delAsync(key);
    } catch (err) {
      console.error("Error deleting key from Redis:", err);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
