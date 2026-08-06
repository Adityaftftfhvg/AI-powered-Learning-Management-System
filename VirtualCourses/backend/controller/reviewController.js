import Review from "../model/reviewModel.js"
import Course from "../model/courseModel.js"


export const addOrUpdateReview = async (req, res) => {
    try {
     const userId = req.userId
  const { courseId } = req.params
        const { rating, comment } = req.body

        if (!rating) {
        return res.status(400).json({ message: "Rating is required" })
        }

    const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        
        if (!course.enrolledStudent.includes(userId)) {
         return res.status(403).json({ message: "Enroll in this course before leaving a review" })
        }

        let review = await Review.findOne({ course: courseId, user: userId })

        if (review) {
        review.rating = rating
            review.comment = comment ?? review.comment
         await review.save()
        } else {
         review = await Review.create({ course: courseId, user: userId, rating, comment })
            course.reviews.push(review._id)
            await course.save()
        }

     return res.status(200).json(review)
    } catch (error) {
  return res.status(500).json({ message: `addOrUpdateReview error ${error}` })
    }
}

export const getCourseReviews = async (req, res) => {
    try {
    const { courseId } = req.params
     const reviews = await Review.find({ course: courseId })
            .populate("user", "name photoUrl")
            .sort({ createdAt: -1 })

       const avgRating = reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
            : 0

        return res.status(200).json({
         reviews,
            avgRating: Number(avgRating.toFixed(1)),
     count: reviews.length
        })
    } catch (error) {
        return res.status(500).json({ message: `getCourseReviews error ${error}` })
    }
}

export const deleteReview = async (req, res) => {
    try {
    const userId = req.userId
     const { reviewId } = req.params

       const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(404).json({ message: "Review not found" })
        }
        if (review.user.toString() !== userId) {
          return res.status(403).json({ message: "Not authorized to delete this review" })
        }

    await Course.findByIdAndUpdate(review.course, { $pull: { reviews: review._id } })
      await review.deleteOne()

        return res.status(200).json({ message: "Review deleted" })
    } catch (error) {
      return res.status(500).json({ message: `deleteReview error ${error}` })
    }
}