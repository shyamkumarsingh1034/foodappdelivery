import express from 'express'
import { googleAuth, resetPassword, sentOtp, signIn, signOut, signUp, verifyOtp } from '../controllers/auth.controllers.js'

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.get("/signout", signOut)
authRouter.post("/sentotp", sentOtp)
authRouter.post("/verifyotp", verifyOtp)
authRouter.post("/resetpassword", resetPassword)
authRouter.post("/googleauth", googleAuth)

export default authRouter
