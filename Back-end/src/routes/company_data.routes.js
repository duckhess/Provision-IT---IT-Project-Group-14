import { Router as express_router } from "express";
import { data_controller } from "../controllers/company_data.controller.js";

const router = express_router();

router.get("/", data_controller);

export default router;
