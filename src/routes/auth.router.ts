import e, { Router } from 'express'
import { register, login, logout, generateToken } from '../controllers/auth.controller'
import { generateKey } from 'crypto'

const authRouter: Router = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.delete('/logout', logout)
authRouter.post('/refresh-token', generateToken);



export default authRouter