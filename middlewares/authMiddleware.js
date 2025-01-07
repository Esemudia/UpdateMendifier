const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) throw new Error();

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};