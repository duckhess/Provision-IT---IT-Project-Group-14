import { Router } from "express";
import { dataController } from "../controllers/company_data.controller.js";

const router = Router();

router.get('/', dataController);

export default router;