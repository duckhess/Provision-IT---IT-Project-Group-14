import { Router as express_router } from "express";
import { liability_controller } from "../controllers/liability.controller.js";

const router = express_router();

router.get("/", liability_controller);

export default router;
