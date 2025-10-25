import { Router as express_router } from "express";
import { fetch_success_rates } from "../controllers/category.controller.js";

const router = express_router();

router.get("/", fetch_success_rates);

export default router;
