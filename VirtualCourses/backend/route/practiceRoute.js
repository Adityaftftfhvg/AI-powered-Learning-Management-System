import express from "express"
import isAuth from "../middleware/isAuth.js"
import { generateProblem, submitSolution, getMyPracticeHistory } from "../controller/practiceController.js"

const practiceRouter = express.Router()

practiceRouter.post("/generate", isAuth, generateProblem)
practiceRouter.post("/submit", isAuth, submitSolution)
practiceRouter.get("/history", isAuth, getMyPracticeHistory)

export default practiceRouter