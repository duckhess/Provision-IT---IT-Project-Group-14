import { Router } from "express";
import { getRatiosByMetricNameController } from "../controllers/key_ratio.controller.js";


const router = Router();

// Params:metric name, app.ID, fileID(optional)
// return values for that metric
router.get('/', getRatiosByMetricNameController);

export default router;