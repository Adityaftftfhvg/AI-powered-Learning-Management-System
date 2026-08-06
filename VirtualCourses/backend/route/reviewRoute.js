import express from "express"
import { addOrUpdateReview, getCourseReviews, deleteReview } from "../controller/reviewController.js"
import isAuth from "../middleware/isAuth.js"

const reviewRouter = express.Router()

  reviewRouter.post("/:courseId", isAuth, addOrUpdateReview)
 reviewRouter.get("/:courseId", getCourseReviews)
   reviewRouter.delete("/:reviewId", isAuth, deleteReview)

export default reviewRouter