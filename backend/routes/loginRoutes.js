import express from 'express';
import jwt from 'jsonwebtoken';
import { tokenverify } from '../auth.js';
import {User} from '../models/user.js';
import { History } from '../models/history.js';
import {Goals} from "../models/goal.js"

const router = express.Router();

// Login route
router.post('/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === '' || password === '') {
      return res.status(400).json({ error: 'Username and password are required', status: 'false' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found', status: 'false' });

    const match = await user.comparePassword(password);

    if (user && match) {
      // create a session or token here for the user if needed
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '7h',
      });

      res
        .status(200)
        .json({ message: 'Login successful', status: 'true', token, userId: user._id, username: user.username,totalMoney: user.totalMoney });
    }else{
      return res.status(400).json({ error: 'Incorrect password', status: 'false' });
    }


  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Error during login' });
  }
});

// Return user
router.get('/get/username/:user_id', async (req,res)=>{
  try{
    const {user_id} = req.params

  }catch (error){
    console.log("Hubo un error: ", error)
  }
})

// Get data Dashboard
router.get('/dashboard/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findById(user_id) 
    const lastHistory = await History.find({user_id}).sort({createAt: -1}).limit(10)

    const goal = await Goals.findOne({user_id})

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if(goal == null) {
      return res.status(200).json({ totalMoney: user.totalMoney, username: user.username, lastHistory, goal : {nameGoal: '', percentage: 0}});
    }
    return res.status(200).json({ totalMoney: user.totalMoney, username: user.username, lastHistory, goal});

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

export default router;

// Get current user data (unused)
router.get('/me/user', tokenverify, async (req, res) => {
  try {
    const user = await User.find({ username: req.username }).select('-password');

    if (!user) return res.status(404).send({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).send({ error: 'Error fetching user data' });
  }
});

