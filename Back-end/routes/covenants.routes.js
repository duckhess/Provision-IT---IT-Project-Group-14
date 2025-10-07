import express from 'express'
import covenants_controller from '../controllers/covenants._controller.js'

const router = express.Router()

router.get('/', covenants_controller.fetch_covenants)

export default router