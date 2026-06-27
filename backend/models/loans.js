import mongoose from 'mongoose';

const loandsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    nameLoand: {
        type: String,
        required: true,
    },
    totalLoanded: {
        type: Number,
        required: true,
    },
    totalPaid: {
        type: Number,
        required: true,
        default: 0
    },
    typeLoand: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        default: 0,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

export const Loans = mongoose.model('Loans', loandsSchema);