import { EventEmitter } from 'events';

class RedisMock extends EventEmitter {
  private store: Map<string, string>;
  private expiries: Map<string, NodeJS.Timeout>;

  constructor() {
    super();
    this.store = new Map();
    this.expiries = new Map();
    // Simulate connection
    setTimeout(() => this.emit('connect'), 100);
    setTimeout(() => this.emit('ready'), 200);
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string): Promise<'OK'> {
    this.store.set(key, value);
    return 'OK';
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    this.store.set(key, value);

    if (this.expiries.has(key)) {
      clearTimeout(this.expiries.get(key));
    }

    const timeout = setTimeout(() => {
      this.store.delete(key);
      this.expiries.delete(key);
    }, seconds * 1000);

    this.expiries.set(key, timeout);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) {
        count++;
        if (this.expiries.has(key)) {
          clearTimeout(this.expiries.get(key));
          this.expiries.delete(key);
        }
      }
    }
    return count;
  }

  async keys(pattern: string): Promise<string[]> {
    if (pattern === '*') return Array.from(this.store.keys());
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return Array.from(this.store.keys()).filter(k => k.startsWith(prefix));
    }
    return Array.from(this.store.keys()).filter(k => k === pattern);
  }

  async ping(): Promise<'PONG'> {
    return 'PONG';
  }

  async quit(): Promise<'OK'> {
    this.expiries.forEach(t => clearTimeout(t));
    this.expiries.clear();
    this.store.clear();
    return 'OK';
  }

  duplicate(): RedisMock {
    return new RedisMock();
  }

  async publish(channel: string, message: string): Promise<number> {
    this.emit('message', channel, message);
    return 1;
  }

  async subscribe(channel: string): Promise<void> {
    return;
  }

  async psubscribe(pattern: string): Promise<void> {
    return;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.store.has(key)) return 0;

    if (this.expiries.has(key)) {
      clearTimeout(this.expiries.get(key));
    }

    const timeout = setTimeout(() => {
        this.store.delete(key);
        this.expiries.delete(key);
    }, seconds * 1000);
    this.expiries.set(key, timeout);

    return 1;
  }

  multi() {
    return {
      incr: (key: string) => {},
      ttl: (key: string) => {},
      exec: async () => {
        return [[null, 1], [null, 60]];
      }
    };
  }
}

export default RedisMock;
