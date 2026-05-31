import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { FeedingService } from "../services/FeedingService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../utils/validate.js";

const router = Router();

const scheduleSchema = z.object({
  animalId: z.number().int().positive(),
  foodItemId: z.number().int().positive(),
  time: z.string().trim().min(4),
  frequency: z.string().trim().min(3),
  quantity: z.string().trim().min(1),
  supplierId: z.number().int().positive().optional(),
});

const markFedSchema = z.object({
  quantity: z.string().trim().optional(),
});

router.get("/", asyncHandler(async (_req, res) => {
  const schedule = await FeedingService.getSchedule();
  res.json({ schedule });
}));

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  validateBody(scheduleSchema),
  asyncHandler(async (req, res) => {
    const entry = await FeedingService.addEntry(req.body);
    res.status(201).json({ entry });
  }),
);

router.post(
  "/:id/mark-fed",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  validateBody(markFedSchema),
  asyncHandler(async (req, res) => {
    const log = await FeedingService.markFed(req.params.id, req.user.id, req.body.quantity);
    res.status(201).json({ log });
  }),
);

export default router;
