import express from 'express';
import jwt from 'jsonwebtoken';
import { tokenverify } from '../auth.js';
import {User} from '../models/user.js';

const router = express.Router();

// Login route
router.post('/user/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);
  console.log('Request body:', req.body);

  try {
    if (username === '' || password === '') {
      return res.status(400).json({ error: 'Username and password are required', status: 'false' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found', status: 'false' });
    }
    const match = await user.comparePassword(password);


    if (user && match) {
      // create a session or token here for the user if needed
      const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res
        .status(200)
        .json({ message: 'Login successful', status: 'true', token, userId: user._id, username: user.username,totalMoney: user.totalMoney });
    }


    if (!match) res.status(401).json({ error: 'Incorrect password', status: 'false' });
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

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`Dashboard data for user ${user.username}: Total Money: ${user.totalMoney}`);
    // Falta retornar historial de movimientos recientes para mostrar en el dashboard
    res.status(200).json({ totalMoney: user.totalMoney, username: user.username });

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

