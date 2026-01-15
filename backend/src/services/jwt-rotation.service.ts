// JWT Secret Rotation Service
import jwt from "jsonwebtoken";
import { config } from "../config";
import { logger } from "../utils/logger";

interface JWTKey {
  id: string;
  secret: string;
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
}

class JWTRotationService {
  private keys: Map<string, JWTKey> = new Map();
  private currentKeyId: string;

  constructor() {
    this.currentKeyId = "key-1";
    this.initializeKeys();
  }

  private initializeKeys() {
    // Initialize with primary key from config
    this.keys.set("key-1", {
      id: "key-1",
      secret: config.jwt.secret,
      createdAt: new Date(),
      isActive: true,
    });

    // Add backup key (rotate every 30 days)
    this.keys.set("key-2", {
      id: "key-2",
      secret: config.jwt.refreshSecret,
      createdAt: new Date(),
      isActive: false,
    });
  }

  // Get current active key
  getCurrentKey(): JWTKey {
    const key = this.keys.get(this.currentKeyId);
    if (!key || !key.isActive) {
      throw new Error("No active JWT key available");
    }

    // Update last used
    key.lastUsed = new Date();
    return key;
  }

  // Get key by ID for token verification
  getKeyById(keyId: string): JWTKey | undefined {
    return this.keys.get(keyId);
  }

  // Verify token using multiple keys (supports rotation)
  verifyToken(token: string): any {
    const decoded = jwt.decode(token) as any;

    if (!decoded || !decoded.kid) {
      // Fallback to current key for backward compatibility
      return jwt.verify(token, config.jwt.secret);
    }

    const key = this.getKeyById(decoded.kid);
    if (!key || !key.isActive) {
      throw new jwt.JsonWebTokenError("Invalid token key");
    }

    return jwt.verify(token, key.secret);
  }

  // Rotate keys (call this periodically)
  rotateKeys(): void {
    try {
      const inactiveKey = Array.from(this.keys.values()).find(
        (k) => !k.isActive,
      );

      if (inactiveKey) {
        // Generate new secret for inactive key
        inactiveKey.secret = this.generateSecureSecret();
        inactiveKey.isActive = true;
        inactiveKey.createdAt = new Date();

        // Deactivate old key
        const oldKey = this.getCurrentKey();
        oldKey.isActive = false;

        // Switch to new key
        this.currentKeyId = inactiveKey.id;

        logger.info(`JWT keys rotated. New active key: ${this.currentKeyId}`);
      }
    } catch (error) {
      logger.error("Failed to rotate JWT keys:", error);
    }
  }

  private generateSecureSecret(): string {
    const crypto = require("crypto");
    return crypto.randomBytes(64).toString("hex");
  }

  // Check if rotation is needed (every 30 days)
  shouldRotate(): boolean {
    const currentKey = this.getCurrentKey();
    const daysSinceCreation =
      (Date.now() - currentKey.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation >= 30;
  }

  // Generate token with key ID
  generateToken(payload: any, expiresIn: string): string {
    const key = this.getCurrentKey();

    return jwt.sign({ ...payload, kid: key.id }, key.secret, { expiresIn });
  }

  // Get status of all keys
  getKeyStatus(): JWTKey[] {
    return Array.from(this.keys.values());
  }
}

// Export singleton instance
export const jwtRotationService = new JWTRotationService();

// Schedule automatic rotation (check daily)
setInterval(
  () => {
    if (jwtRotationService.shouldRotate()) {
      jwtRotationService.rotateKeys();
    }
  },
  24 * 60 * 60 * 1000,
); // Daily check
