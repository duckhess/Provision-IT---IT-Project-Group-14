import { Router as express_router } from "express";
import { fetch_abs_controller } from "../controllers/abs.controller.js";

const router = express_router();

router.get("/", fetch_abs_controller);

export default router;
