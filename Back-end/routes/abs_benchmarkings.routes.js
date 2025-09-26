import express from 'express'
import abs_controller from '../controllers/abs_controller.js'

const router = express.Router()

router.get('/', abs_controller.fetch_abs)

export default router