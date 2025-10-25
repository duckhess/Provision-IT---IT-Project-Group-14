import { Router as express_router } from "express";
import { fetch_cash_equivalences } from "../controllers/cash_equivalences.controller.js";

const router = express_router();

router.get("/", fetch_cash_equivalences);

export default router;
