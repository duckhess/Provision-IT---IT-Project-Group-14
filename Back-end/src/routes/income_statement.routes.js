import { Router as express_router } from "express";
import { income_controller } from "../controllers/income_statement.controller.js";

const router = express_router();

router.get("/", income_controller);

export default router;
