const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const twilio = require('twilio');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
 //Otp generation
exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Send OTP via Twilio WhatsApp
        const message = await twilioClient.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${phone}`,
            body: `Your verification code is ${otp}`
        });

        console.log('Twilio response:', message.sid);

        // Update MongoDB with OTP and timestamp
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        res.status(200).json({ message: 'OTP sent successfully', userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending OTP' });
    }
};

// Sign-up
exports.signUp = async (req, res) => {
    try {
        const { name, phone, password, email } = req.body;

        console.log(req.body)
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
 // verify otp
exports.verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error verifying OTP' });
    }
};

