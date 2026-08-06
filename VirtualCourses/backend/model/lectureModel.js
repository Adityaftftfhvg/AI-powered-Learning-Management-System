import mongoose from "mongoose"

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
       videoUrl: {
        type: String,
        required: true
    },
 isPreviewFree: {
      type: Boolean,
        default: false
    },
    isPreviewFree: {
        type: Boolean,
        default: false
    },
    transcript: {
        type: String,
        default: ""
    },
          course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }
}, { timestamps: true })

const Lecture = mongoose.model("Lecture", lectureSchema)
export default Lecture