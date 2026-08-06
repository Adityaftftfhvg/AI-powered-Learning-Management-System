import express from "express"
import isAuth from "../middleware/isAuth.js"
import { reviewResume } from "../controller/resumeController.js"

const resumeRouter = express.Router()

resumeRouter.post("/review", isAuth, reviewResume)

export default resumeRouter