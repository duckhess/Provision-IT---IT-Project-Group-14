import { Router as express_router } from "express";
import { best_metrics_controller } from "../controllers/best_four_metrics.controller.js";

const router = express_router();

router.get("/", best_metrics_controller);

export default router;
