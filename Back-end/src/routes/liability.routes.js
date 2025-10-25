import { Router } from "express";
import { liabilityController } from "../controllers/liability.controller.js";

const router = Router();

router.get("/", liabilityController);

export default router;
