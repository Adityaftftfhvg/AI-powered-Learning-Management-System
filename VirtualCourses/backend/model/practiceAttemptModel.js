import mongoose from "mongoose"

const practiceAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: { type: String, required: true },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    problemTitle: { type: String, required: true },
    verdict: {
        type: String,
        enum: ["Correct", "Partially Correct", "Incorrect"],
        required: true
    },
    score: { type: Number, default: 0 },
    language: { type: String, default: "javascript" }
}, { timestamps: true })

const PracticeAttempt = mongoose.model("PracticeAttempt", practiceAttemptSchema)
export default PracticeAttempt