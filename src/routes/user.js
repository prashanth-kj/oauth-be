import express from 'express'
import userController from '../controller/user.js'
import Auth from '../utlis/auth.js'
const router = express.Router()

router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.get('/user',Auth.validate,userController.getuserById)

export default router