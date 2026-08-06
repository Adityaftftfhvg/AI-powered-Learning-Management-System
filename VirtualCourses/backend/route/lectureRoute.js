import express from "express"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import {
    createLecture,
  getLecturesByCourse,
      editLecture,
     removeLecture,
 reorderLectures
} from "../controller/lectureController.js"

const lectureRouter = express.Router()

  lectureRouter.post("/create/:courseId", isAuth, upload.single("video"), createLecture)
 lectureRouter.get("/getbycourse/:courseId", isAuth, getLecturesByCourse)
    lectureRouter.post("/edit/:lectureId", isAuth, upload.single("video"), editLecture)
  lectureRouter.delete("/remove/:lectureId", isAuth, removeLecture)
 lectureRouter.post("/reorder/:courseId", isAuth, reorderLectures)

export default lectureRouter