import express from "express"
import isAuth from "../middleware/isAuth.js"
import {
    setLastWatched,
    markLectureComplete,
    getCourseProgress,
    getMyProgressSummary
} from "../controller/progressController.js"

const progressRouter = express.Router()

progressRouter.post("/lecture-watched", isAuth, setLastWatched)
progressRouter.post("/complete-lecture", isAuth, markLectureComplete)
progressRouter.get("/summary/me", isAuth, getMyProgressSummary)
progressRouter.get("/:courseId", isAuth, getCourseProgress)

export default progressRouter