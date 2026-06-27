import mongoose from "mongoose";

const debtsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    nameDebts: {
        type: String,
        required: true,
        unique: true,
    },
    totalDebt: {
        type: Number,
        required: true,
    },
    totalPaid: {
        type: Number,
        required: true,
        default: 0,
    },
    interest: {
        type: Number,
        required: true,
        default: 0,
    },
    percentageInterest: {
        type: Number,
        required: true,
        default: 0,
    },
    saveDebtTotal: {
        type: Number,
        required: true,
        default: 0,
    },
    percentagePaid: {
        type: Number,
        required: true,
        default: 0,
    }
})

export const Debts = mongoose.model('Debts', debtsSchema);