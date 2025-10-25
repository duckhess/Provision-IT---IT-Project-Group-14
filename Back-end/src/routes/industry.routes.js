import { Router as express_router } from "express";
import { list_industries_controller } from "../controllers/industry.controller.js";

const router = express_router();

router.get("/", list_industries_controller);

export default router;
