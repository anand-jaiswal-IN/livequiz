import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import redisClient from "../config/redis.js";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_access_secret_key_847291";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_key_958102";

// Helper to sign tokens
function generateTokens(user: { id: string; username: string; email: string }) {
  const payload = { userId: user.id, username: user.username, email: user.email };
  
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required." });
      }

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      });

      if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
          return res.status(400).json({ error: "User with this email already exists." });
        }
        return res.status(400).json({ error: "Username is already taken." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email: email.toLowerCase(),
        passwordHash,
      });

      await newUser.save();

      const tokens = generateTokens({
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      });

      return res.status(201).json({
        user: {
          id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
        },
        tokens,
      });
    } catch (error: any) {
      console.error("Register Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password." });
      }

      const tokens = generateTokens({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      });

      return res.json({
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
        tokens,
      });
    } catch (error: any) {
      console.error("Login Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required." });
      }

      // Check if token is blacklisted in Redis
      const isBlacklisted = await redisClient.get(`blacklist:${refreshToken}`);
      if (isBlacklisted) {
        return res.status(401).json({ error: "Token has been revoked. Please login again." });
      }

      try {
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
        
        // Generate new tokens
        const tokens = generateTokens({
          id: payload.userId,
          username: payload.username,
          email: payload.email,
        });

        // Optional: Blacklist old refresh token to prevent reuse (token rotation)
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const secondsRemaining = payload.exp - currentTimestamp;
        if (secondsRemaining > 0) {
          await redisClient.setEx(`blacklist:${refreshToken}`, secondsRemaining, "true");
        }

        return res.json(tokens);
      } catch (err) {
        return res.status(401).json({ error: "Session expired or invalid refresh token." });
      }
    } catch (error: any) {
      console.error("Refresh Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        try {
          const payload = jwt.decode(refreshToken) as any;
          if (payload && payload.exp) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const secondsRemaining = payload.exp - currentTimestamp;
            if (secondsRemaining > 0) {
              // Blacklist in Redis
              await redisClient.setEx(`blacklist:${refreshToken}`, secondsRemaining, "true");
            }
          }
        } catch (err) {
          // Token decode failed or already expired, ignore
        }
      }
      return res.json({ message: "Successfully logged out." });
    } catch (error: any) {
      console.error("Logout Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      return res.json({ user });
    } catch (error: any) {
      console.error("GetMe Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
};
