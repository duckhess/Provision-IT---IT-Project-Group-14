import { Router } from "express";
import { liabilityController } from "../controllers/liability.controllers.js";

const router = Router();

router.get('/', liabilityController);

export default router;