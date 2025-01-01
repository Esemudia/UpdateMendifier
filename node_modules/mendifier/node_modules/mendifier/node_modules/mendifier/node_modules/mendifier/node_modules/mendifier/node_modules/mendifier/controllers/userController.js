const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Sign-up
exports.signUp = async (req, res) => {
    try {
        const { name, phone, password, email } = req.body;

        console.log(name,phone,password,emai)
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ error: 'Phone number already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, phone, password: hashedPassword, email });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user',});
    }
};

// Sign-in
exports.signIn = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Error signing in' });
    }
};

// Edit profile
exports.editProfile = async (req, res) => {
    try {
        const { userId, name, email } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
};

// Verify user
exports.verifyUser = async (req, res) => {
    try {
        const { userId, isVerified } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isVerified = isVerified;
        await user.save();

        res.status(200).json({ message: 'User verification updated', user });
    } catch (error) {
        res.status(500).json({ error: 'Error verifying user' });
    }
};
