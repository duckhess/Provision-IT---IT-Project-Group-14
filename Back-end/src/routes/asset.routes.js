import { Router as express_router } from "express";
import { asset_controller } from "../controllers/asset.controller.js";

const router = express_router();

router.get("/", asset_controller);

export default router;
