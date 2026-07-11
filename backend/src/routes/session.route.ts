import { Router } from "express";
import { sessionController } from "../controllers/session.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes for participants
router.get("/:code", sessionController.getSession);
router.post("/:code/join", sessionController.joinSession);
router.post("/:code/submit", sessionController.submitAnswer);

// Host routes (protected)
router.post("/:code/next", authMiddleware as any, sessionController.nextQuestion);
router.post("/:code/end", authMiddleware as any, sessionController.endSession);

export default router;
