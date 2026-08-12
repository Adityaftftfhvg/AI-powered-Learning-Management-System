import express from "express"
import { CreateCourse, editCourse, getCourseById, getCreatorCourses, getEducatorStats, getPublishedCourses, removeCourse, aiSearchCourses, enrollInCourse } from "../controller/courseController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import uploadOnCloudinary from "../config/cloudinary.js"

const courseRouter = express.Router()

courseRouter.post("/create", isAuth, CreateCourse)
  courseRouter.get("/getpublished", isAuth, getPublishedCourses)
 courseRouter.get("/getcreator", isAuth, getCreatorCourses)
    courseRouter.get("/educator/stats", isAuth, getEducatorStats)
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
 courseRouter.get("/getcoursebyid/:courseId", isAuth, getCourseById)
courseRouter.delete("/remove/:courseId", isAuth, removeCourse)
   courseRouter.post("/ai-search", isAuth, aiSearchCourses)
courseRouter.post("/enroll/:courseId", isAuth, enrollInCourse)

export default courseRouter
