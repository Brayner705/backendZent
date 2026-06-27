import mongoose  from "mongoose";

const savingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    goals: [{
        nameGoal : String,
        totalGoal : Number,
        savedAmount: Number
    }],
    typeGoals: {
        type: [String],
    },
    totalSaved: {
        type: Number,
        default: 0,
    },
    totalGoals: {
        type: Number,
        default: 0,
    }
})

export const Saving = mongoose.model('Saving', savingSchema);