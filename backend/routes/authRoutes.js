import express from "express";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(express.json());
// Generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Routes
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'test' });
});

// Login route (stub - optional to implement later)
router.post('/login', (req, res) => {
    res.send('login');
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        // Check if user already exists
        const userExist = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExist) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Generate avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        // Create new user
        const user = new User({
            email,
            username,
            password,
            profileImage
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Respond with user data and token
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

export default router;
