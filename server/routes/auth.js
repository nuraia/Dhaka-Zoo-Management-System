import { Router } from "express";
import { z } from "zod";
import { AuthController } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../utils/validate.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().trim(),
  phone: z.string().trim().optional(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(1),
});

router.post("/register", validateBody(registerSchema), asyncHandler(AuthController.register));
router.post("/login", validateBody(loginSchema), asyncHandler(AuthController.login));
router.get("/me", requireAuth, asyncHandler(AuthController.me));

export default router;
