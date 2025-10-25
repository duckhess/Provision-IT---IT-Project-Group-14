import { Router as express_router } from "express";
import { fetch_forecasts } from "../controllers/forecast.controller.js";

const router = express_router();

router.get("/", fetch_forecasts);

export default router;
