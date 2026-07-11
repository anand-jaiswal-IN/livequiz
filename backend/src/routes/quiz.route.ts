import { Router } from "express";
import { quizController } from "../controllers/quiz.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Creator routes (protected)
router.get("/", authMiddleware as any, quizController.getQuizzes);
router.post("/", authMiddleware as any, quizController.createQuiz);
router.get("/:id", authMiddleware as any, quizController.getQuizById);
router.put("/:id", authMiddleware as any, quizController.updateQuiz);
router.delete("/:id", authMiddleware as any, quizController.deleteQuiz);
router.post("/:id/publish", authMiddleware as any, quizController.publishQuiz);

// Participant route (public)
router.get("/join/:code", quizController.getQuizByJoinCode);
router.post("/join/:code/verify", quizController.verifyAnswer);

export default router;
