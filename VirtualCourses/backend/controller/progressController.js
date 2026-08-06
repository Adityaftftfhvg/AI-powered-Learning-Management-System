import Progress from "../model/progressModel.js"
import Course from "../model/courseModel.js"
import Certificate from "../model/certificateModel.js"
import { recordActivity } from "../utils/gamification.js"

const LECTURE_COMPLETE_XP = 10
const COURSE_COMPLETE_XP = 100

export const setLastWatched = async (req, res) => {
    try {
        const userId = req.userId
        const { courseId, lectureId } = req.body
        if (!courseId || !lectureId) {
            return res.status(400).json({ message: "courseId and lectureId are required" })
        }

        const progress = await Progress.findOneAndUpdate(
            { user: userId, course: courseId },
            { $set: { lastWatchedLecture: lectureId }, $setOnInsert: { completedLectures: [] } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        return res.status(200).json(progress)
    } catch (error) {
        return res.status(500).json({ message: `setLastWatched error ${error}` })
    }
}

export const markLectureComplete = async (req, res) => {
    try {
        const userId = req.userId
        const { courseId, lectureId } = req.body
        if (!courseId || !lectureId) {
            return res.status(400).json({ message: "courseId and lectureId are required" })
        }

        const course = await Course.findById(courseId)
        if (!course) return res.status(404).json({ message: "Course not found" })

        let progress = await Progress.findOne({ user: userId, course: courseId })
        if (!progress) {
            progress = new Progress({ user: userId, course: courseId, completedLectures: [] })
        }

        const alreadyCompleted = progress.completedLectures.some(
            (id) => id.toString() === lectureId
        )

        if (!alreadyCompleted) {
            progress.completedLectures.push(lectureId)
            await recordActivity(userId, LECTURE_COMPLETE_XP)
        }

        progress.lastWatchedLecture = lectureId

        const totalLectures = course.lectures.length || 1
        progress.percent = Math.round((progress.completedLectures.length / totalLectures) * 100)

        let certificateIssued = false
        if (progress.percent >= 100 && !progress.completedAt) {
            progress.completedAt = new Date()
            const existingCert = await Certificate.findOne({ user: userId, course: courseId })
            if (!existingCert) {
                await Certificate.create({ user: userId, course: courseId })
                await recordActivity(userId, COURSE_COMPLETE_XP)
                certificateIssued = true
            }
        }

        await progress.save()

        return res.status(200).json({ ...progress.toObject(), certificateIssued })
    } catch (error) {
        return res.status(500).json({ message: `markLectureComplete error ${error}` })
    }
}

export const getCourseProgress = async (req, res) => {
    try {
        const userId = req.userId
        const { courseId } = req.params

        const progress = await Progress.findOne({ user: userId, course: courseId })
        if (!progress) {
            return res.status(200).json({
                completedLectures: [],
                lastWatchedLecture: null,
                percent: 0,
                completedAt: null
            })
        }

        return res.status(200).json(progress)
    } catch (error) {
        return res.status(500).json({ message: `getCourseProgress error ${error}` })
    }
}

export const getMyProgressSummary = async (req, res) => {
    try {
        const userId = req.userId
        const progressList = await Progress.find({ user: userId }).populate("course", "title thumbnail")
        return res.status(200).json(progressList)
    } catch (error) {
        return res.status(500).json({ message: `getMyProgressSummary error ${error}` })
    }
}