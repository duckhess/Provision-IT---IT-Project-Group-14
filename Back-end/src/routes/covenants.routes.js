import { Router as express_router } from "express";
import { fetch_covenants } from "../controllers/covenants.controller.js";

const router = express_router();

router.get("/", fetch_covenants);

export default router;
