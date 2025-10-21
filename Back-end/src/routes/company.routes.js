import { Router } from "express"
import { list_companies_controller } from "../controllers/company.controller.js"

const router = Router()

// return full companies list
router.get("/", list_companies_controller)

export default router