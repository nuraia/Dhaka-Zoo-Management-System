import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/authMiddleware.js";
import { DayPlannerService } from "../services/DayPlannerService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../utils/validate.js";

const router = Router();

const planSchema = z.object({
  date: z.iso.date(),
  notes: z.string().trim().optional(),
  zoneIds: z.array(z.number().int().positive()).default([]),
});

router.post("/", requireAuth, validateBody(planSchema), asyncHandler(async (req, res) => {
  const plan = await DayPlannerService.createPlan(req.user.id, req.body);
  res.status(201).json({ plan });
}));

router.get("/:date", requireAuth, asyncHandler(async (req, res) => {
  const plan = await DayPlannerService.getPlan(req.user.id, req.params.date);
  res.json({ plan });
}));

router.put("/:id", requireAuth, validateBody(planSchema.partial()), asyncHandler(async (req, res) => {
  const plan = await DayPlannerService.updatePlan(req.user.id, req.params.id, req.body);
  res.json({ plan });
}));

export default router;
