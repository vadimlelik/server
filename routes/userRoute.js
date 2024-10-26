import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/auth-middleware.js'

export const router = Router()

router.get('/', authMiddleware, UserController.getUser)

export default router
