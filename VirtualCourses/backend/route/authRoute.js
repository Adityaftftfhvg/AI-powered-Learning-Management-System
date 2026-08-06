import express from 'express'
import passport from 'passport'
import { login, logOut, signup, forgotPassword, resetPassword } from '../controller/authController.js'
import genToken from '../config/token.js'


const authRouter = express.Router()

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.get("/logout", logOut)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)
authRouter.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)
authRouter.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
       
        const token = await genToken(req.user._id)
       res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
})
       
        res.redirect(process.env.FRONTEND_URL + "/")
    }
)
export default authRouter