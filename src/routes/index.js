import express from 'express'
import authRoutes from './auth.js'
import userRoutes from './user.js'
const router = express.Router()

router.use('/auth',authRoutes)
router.use('/customer',userRoutes)
export default router