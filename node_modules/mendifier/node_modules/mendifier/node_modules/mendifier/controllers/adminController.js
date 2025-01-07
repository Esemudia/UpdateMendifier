const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signUp = async (req, res) => {
    try {
        const { name, email, password,phone } = req.body;
        const user = new Admin({ name, email, password,phone });
        await user.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error signing up', error });
    }
};

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        //const token = jwt.sign({ id: user._id, type: user.type }, 'secret_key', { expiresIn: '1d' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).json({ message: 'Error signing in', error });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const { type } = req.query;
        const users = await User.find(type ? { type } : {});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndUpdate(userId, { isBanned: true });
        res.json({ message: 'User banned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error banning user', error });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.query;
        const users = await User.findById({userId});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};