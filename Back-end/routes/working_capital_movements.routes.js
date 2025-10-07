import express from 'express'
import wcm_controller from '../controllers/wcm_controller.js'

const router = express.Router()

router.get('/', wcm_controller.fetch_wcm)

export default router