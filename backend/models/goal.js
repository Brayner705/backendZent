import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    nameGoal: {
        type: String,
        required: true,
        unique:true
    },
    totalSaved: {
        type: Number,
        required: true,
        default: 0
    },
    totalGoal: {
        type: Number,
        required: true,
        default: 0
    },
    percentage: {
        type: Number,
        required: true,
        default: 0
    }
})

export const Goals = mongoose.model("Goals", goalSchema)