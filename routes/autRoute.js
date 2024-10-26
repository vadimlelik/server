import { Router } from 'express'
import {
	login,
	logout,
	refresh,
	register,
} from '../controllers/authController.js'

export const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/refresh', refresh)

export default router
