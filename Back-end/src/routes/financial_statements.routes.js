import { Router as express_router } from "express";
import { fetch_statements } from "../controllers/financial_statements.controller.js";

const router = express_router();

router.get("/", fetch_statements);

export default router;
