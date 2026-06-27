import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  user_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferredCurrency : {
    type: String,
    default: 'VES',
  },
  totalMoney: {
    type: Number,
    default: 0,
  },
  totalMoneySaving: {
    type: Number,
    default: 0,
  },
  totalMoneySpent: {
    type: Number,
    default: 0,
  },
  totalMoneyDebt: {
    type: Number,
    default: 0,
  },
  totalWeek1: {
    type: Number,
    default: 0,
  },
  totalWeek2: {
    type: Number,
    default: 0,
  },
  totalWeek3: {
    type: Number,
    default: 0,
  },
  totalWeek4: {
    type: Number,
    default: 0,
  },
  totalWeek5: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw new Error('Error hashing password: ', err);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword){
  return await bcrypt.compare(candidatePassword, this.password);
}

export const User = mongoose.model('User', userSchema);
