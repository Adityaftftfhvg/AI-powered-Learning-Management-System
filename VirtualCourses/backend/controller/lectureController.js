import Lecture from "../model/lectureModel.js"
import Course from "../model/courseModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"

export const createLecture = async (req, res) => {
    try {
 const { courseId } = req.params
     const { title, isPreviewFree } = req.body

        if (!title) {
   return res.status(400).json({ message: "Lecture title is required" })
        }
        if (!req.file) {
          return res.status(400).json({ message: "Lecture video is required" })
        }

        const course = await Course.findById(courseId)
        if (!course) {
  return res.status(404).json({ message: "Course not found" })
        }
        if (course.creator.toString() !== req.userId) {
          return res.status(403).json({ message: "Not authorized to edit this course" })
        }

      const videoUrl = await uploadOnCloudinary(req.file.path)

  const lecture = await Lecture.create({
         title,
           videoUrl,
         isPreviewFree: isPreviewFree === "true",
            course: courseId
        })

  course.lectures.push(lecture._id)
       await course.save()

     return res.status(201).json(lecture)
    } catch (error) {
        return res.status(500).json({ message: `createLecture error ${error}` })
    }
}

export const getLecturesByCourse = async (req, res) => {
    try {
    const { courseId } = req.params
       const course = await Course.findById(courseId).populate("lectures")
     if (!course) {
          return res.status(404).json({ message: "Course not found" })
        }

        const isEnrolled = req.userId && course.enrolledStudent.some(
      (studentId) => studentId.toString() === req.userId
        )
        const isCreator = req.userId && course.creator.toString() === req.userId

        
     const safeLectures = course.lectures.map((lecture) => {
         const canWatch = isEnrolled || isCreator || lecture.isPreviewFree
  const lectureObj = lecture.toObject()
            if (!canWatch) {
                lectureObj.videoUrl = null
            }
      return lectureObj
        })

   return res.status(200).json(safeLectures)
    } catch (error) {
        return res.status(500).json({ message: `getLecturesByCourse error ${error}` })
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const { title, isPreviewFree } = req.body

    let lecture = await Lecture.findById(lectureId)
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" })
        }

      const updateData = { title, isPreviewFree: isPreviewFree === "true" }
        if (req.file) {
            updateData.videoUrl = await uploadOnCloudinary(req.file.path)
        }

      lecture = await Lecture.findByIdAndUpdate(lectureId, updateData, { new: true })
   return res.status(200).json(lecture)
    } catch (error) {
      return res.status(500).json({ message: `editLecture error ${error}` })
    }
}

export const removeLecture = async (req, res) => {
    try {
     const { lectureId } = req.params
       const lecture = await Lecture.findById(lectureId)
        if (!lecture) {
         return res.status(404).json({ message: "Lecture not found" })
        }

     await Course.findByIdAndUpdate(lecture.course, { $pull: { lectures: lectureId } })
       await Lecture.findByIdAndDelete(lectureId)

        return res.status(200).json({ message: "Lecture removed" })
    } catch (error) {
        return res.status(500).json({ message: `removeLecture error ${error}` })
    }
}

export const reorderLectures = async (req, res) => {
    try {
   const { courseId } = req.params
      const { lectureIds } = req.body

         const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        course.lectures = lectureIds
      await course.save()

          return res.status(200).json({ message: "Order updated" })
    } catch (error) {
  return res.status(500).json({ message: `reorderLectures error ${error}` })
    }
}