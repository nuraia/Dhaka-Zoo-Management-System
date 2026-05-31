import { Router } from "express";
import prisma from "../lib/prisma.ts";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(async (_req, res) => {
  const zones = await prisma.zone.findMany({
    include: { _count: { select: { animals: true } } },
    orderBy: { name: "asc" },
  });

  res.json({ zones });
}));

export default router;
