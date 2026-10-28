import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_access_secret_key_847291";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication token required.",
      code: "TOKEN_MISSING",
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({
      error: "Authentication token format is invalid.",
      code: "TOKEN_INVALID",
    });
  }

  const token = parts[1] as string;

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
    const activeSessionId = await redisClient.get(`auth:session:${payload.userId}`);
    if (!payload.sid || activeSessionId !== payload.sid) {
      return res.status(401).json({
        error: "Session has been revoked. Please login again.",
        code: "SESSION_REVOKED",
      });
    }
    req.user = {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
    };
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Access token expired.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      error: "Invalid or corrupt token.",
      code: "TOKEN_INVALID",
    });
  }
}
