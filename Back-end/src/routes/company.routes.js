import { Router as express_router } from "express";
import { list_companies_controller } from "../controllers/company.controller.js";

const router = express_router();

// return full companies list
router.get("/", list_companies_controller);

export default router;
