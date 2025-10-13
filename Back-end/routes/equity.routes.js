import { Router } from "express";
import { equityController } from "../controllers/equity.controller.js";

const router = Router();

router.get('/', equityController);

export default router;