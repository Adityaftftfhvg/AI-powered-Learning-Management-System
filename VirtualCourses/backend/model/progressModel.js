import mongoose from "mongoose"

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completedLectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }],
    lastWatchedLecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        default: null
    },
    percent: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

progressSchema.index({ user: 1, course: 1 }, { unique: true })

const Progress = mongoose.model("Progress", progressSchema)
export default Progress