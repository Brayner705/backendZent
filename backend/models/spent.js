import mongoose  from "mongoose";

const spentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalWeek1Spent: {
        type: Number,
        required: true,
        default: 0
    },
    totalWeek2Spent: {
        type: Number,
        required: true,
        default: 0
    },
    totalWeek3Spent: {
        type: Number,
        required: true,
        default: 0
    },
    totalWeek4Spent: {
        type: Number,
        required: true,
        default: 0
    },
    totalWeek5Spent: {
        type: Number,
        required: true,
        default: 0
    },
})

export const Spent = mongoose.model('Spent', spentSchema);