import { Router as express_router } from "express";
import { equity_controller } from "../controllers/equity.controller.js";

const router = express_router();

router.get("/", equity_controller);

export default router;
