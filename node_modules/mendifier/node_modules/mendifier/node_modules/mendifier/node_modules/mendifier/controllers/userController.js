const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const twilio = require('twilio');
const multer = require('multer');
const kyc = require('../models/kyc');
const number="+14155238886"

const twilioClient = twilio('AC04bd7aae1f82d8a5dc384e24b6ac04de', 'b55bb9e4354dd3e0386c00984f97a202');
 //Otp generation
exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        // Check if phone number already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ error: 'Phone number is already registered' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save or update the user document with OTP and expiry
        const user = await User.findOneAndUpdate(
            { phone },
            { otp, otpExpires: Date.now() + 10 * 60 * 1000 }, // OTP valid for 10 minutes
            { upsert: true, new: true }
        );

        // Send OTP via Twilio
        await twilioClient.messages.create({
            from: `whatsapp:${number}`,
            to: `whatsapp:${phone}`,
            body: `${otp} is your verification code. For your security, do not share this code.`
        });

        res.status(200).json({ message: 'OTP sent successfully', userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error initiating signup' });
    }
};


// Sign-up
exports.signUp = async (req, res) => {
    try {
        const { userId, name, email, password, type } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({ error: 'User not verified' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user details
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        user.type= type

        await user.save();

        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user details' });
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

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check OTP and expiry
        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Mark the user as verified and clear OTP
      
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error verifying OTP' });
    }
};

exports.serviceprovider=async (req,res)=>{

    try{
        const{userId,about,jobtitleId,email,state,address,coordinate}= req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
            user.about=about;
            user.jobtitle=jobtitleId;
            user.email=email;
            user.state=state;
            user.address= address;
            user.geometery=coordinate;
            await user.save()
            res.status(200).json({ message: 'User details updated successfully', user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating user details' });
        }
    
}


exports.uploadKYC= async (req,res)=>{
    try {
        const {userId,documentType}= req.body
        const newImage = new kyc({
           user:userId,
           documentType:documentType,
          name: req.file.filename,
          path: req.file.path,
        });
        await newImage.save();
        res.send('File uploaded and saved to database');
      } catch (error) {
        console.log(error)
        res.status(500).send('Error uploading file', error);
      }
}