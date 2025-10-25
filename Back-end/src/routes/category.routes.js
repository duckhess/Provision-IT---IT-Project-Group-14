// routes/success_rate.routes.js
import express from "express";
import { fetch_success_rates } from "../controllers/category.controller.js";

const router = express.Router();

// GET /api/success-rate?applicationid=123
router.get("/", fetch_success_rates);

export default router;
