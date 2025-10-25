import { Router as express_router } from "express";
import { fetch_wcm } from "../controllers/wcm.controller.js";

const router = express_router();

router.get("/", fetch_wcm);

export default router;
