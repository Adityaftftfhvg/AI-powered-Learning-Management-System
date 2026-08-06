import express from 'express'
import dotenv from 'dotenv'
dotenv.config()                         
import connectDB from './config/connectDB.js'
import lectureRouter from './route/lectureRoute.js'
import cookieParser from 'cookie-parser'
import authRouter from './route/authRoute.js'
import cors from "cors"
import userRouter from './route/userRoute.js'
import session from 'express-session'
import passport from './config/passport.js'     
import courseRouter from './route/courseRoute.js'
import reviewRouter from './route/reviewRoute.js'
import paymentRouter from './route/paymentRoute.js'
import aiRouter from './route/aiRoute.js'
import progressRouter from './route/progressRoute.js'
import certificateRouter from './route/certificateRoute.js'
import practiceRouter from './route/practiceRoute.js'
import resumeRouter from './route/resumeRoute.js'
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
   origin: process.env.FRONTEND_URL || "http://localhost:5173",
   credentials: true
}))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => res.send("I am listening"))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course",courseRouter)
app.use("/api/ai", aiRouter)
app.use("/api/lecture", lectureRouter)
app.use("/api/review", reviewRouter)

app.use("/api/payment", paymentRouter)
app.use("/api/progress", progressRouter)
app.use("/api/certificate", certificateRouter)
app.use("/api/practice", practiceRouter)
app.use("/api/resume", resumeRouter)
const port = process.env.PORT
app.listen(port, () => {
    console.log("Working well!!")
    connectDB()
})