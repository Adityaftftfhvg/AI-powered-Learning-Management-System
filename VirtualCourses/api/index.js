import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from '../backend/config/connectDB.js'
import lectureRouter from '../backend/route/lectureRoute.js'
import cookieParser from 'cookie-parser'
import authRouter from '../backend/route/authRoute.js'
import cors from "cors"
import userRouter from '../backend/route/userRoute.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from '../backend/config/passport.js'
import courseRouter from '../backend/route/courseRoute.js'
import reviewRouter from '../backend/route/reviewRoute.js'
import paymentRouter from '../backend/route/paymentRoute.js'
import aiRouter from '../backend/route/aiRoute.js'
import progressRouter from '../backend/route/progressRoute.js'
import certificateRouter from '../backend/route/certificateRoute.js'
import practiceRouter from '../backend/route/practiceRoute.js'
import resumeRouter from '../backend/route/resumeRoute.js'
const app = express()

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
   origin: process.env.FRONTEND_URL || "http://localhost:5173",
   credentials: true
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL })
}))
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => res.send("I am listening"))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/ai", aiRouter)
app.use("/api/lecture", lectureRouter)
app.use("/api/review", reviewRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/progress", progressRouter)
app.use("/api/certificate", certificateRouter)
app.use("/api/practice", practiceRouter)
app.use("/api/resume", resumeRouter)


export default app