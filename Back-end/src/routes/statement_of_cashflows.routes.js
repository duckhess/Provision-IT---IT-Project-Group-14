import { Router as express_router } from "express";
import { soc_controller } from "../controllers/statement_of_cashflows.controller.js";

const router = express_router();

router.get("/", soc_controller);

export default router;
