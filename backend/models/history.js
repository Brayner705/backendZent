import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    nameMovement: {
        type: String,
        required: true,
    },
    typeOperation: {
        type: String,
        required: true,
    },
    money: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

export const History = mongoose.model('History', historySchema);