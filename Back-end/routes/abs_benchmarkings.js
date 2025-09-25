import express from 'express'
import abs_controller from '../controllers/abs_controller.js'

const router = express.Router()

router.get('/fetch_abs', abs_controller.fetch_abs)
router.get('/fetch_benchmark', abs_controller.fetch_benchmark)
router.get('/fetch_all_abs', abs_controller.fetch_all_abs)

export default router