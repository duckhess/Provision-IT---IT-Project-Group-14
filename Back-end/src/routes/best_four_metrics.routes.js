import { Router } from "express";
import { bestMetricsController } from "../controllers/best_four_metrics.controller.js";

const router = Router();

router.get("/", bestMetricsController);

export default router;
