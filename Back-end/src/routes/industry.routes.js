import { Router } from "express";
import { list_industries_controller } from "../controllers/industry.controller.js";

const router = Router();

router.get("/", list_industries_controller);

export default router;
