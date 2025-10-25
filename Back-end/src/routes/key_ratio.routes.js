import { Router as express_router } from "express";
import { key_ratio_controller } from "../controllers/key_ratio.controller.js";

const router = express_router();

router.get("/", key_ratio_controller);

export default router;
