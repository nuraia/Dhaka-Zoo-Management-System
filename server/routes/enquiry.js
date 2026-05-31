import { Router } from "express";
import { EnquiryService } from "../services/EnquiryService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(async (_req, res) => {
  const response = await EnquiryService.ask();
  res.json(response);
}));

export default router;
