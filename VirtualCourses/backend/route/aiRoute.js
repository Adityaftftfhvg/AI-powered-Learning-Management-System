import express from "express"
import isAuth from "../middleware/isAuth.js"
import { generateTranscript, generateLectureQuiz, generateCourseQuiz, mockInterviewReply, mockInterviewFeedback } from "../controller/aiController.js"

const aiRouter = express.Router()

  aiRouter.post("/transcript/:lectureId", isAuth, generateTranscript)
 aiRouter.post("/quiz/lecture/:lectureId", isAuth, generateLectureQuiz)
   aiRouter.post("/quiz/course/:courseId", isAuth, generateCourseQuiz)
 aiRouter.post("/mock-interview/reply", isAuth, mockInterviewReply)
    aiRouter.post("/mock-interview/feedback", isAuth, mockInterviewFeedback)

export default aiRouter