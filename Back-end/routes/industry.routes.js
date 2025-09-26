import { Router } from "express"
import {
  list_industries_controller,
  //get_industry_by_id_controller
} from "../controllers/industry.controller.js"

const router = Router();

// reutrn all industries
router.get("/", list_industries_controller)

// return industry with Id = id
router.get("/:industry_id", list_industries_controller)

export default router


