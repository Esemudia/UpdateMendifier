const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Post= require('../models/post')
const Blacklist = require('../models/blacklist')
const Mail= require('../models/post')
const userKYC= require('../models/kyc')
const nodemailer = require('nodemailer');
const Approval= require('../models/approveserviceprovider');
const EmailLog = require('../models/EmailLog');

exports.signUp = async (req, res) => {
    try {
        const { name, email, password,phone,role } = req.body;;
        const hashedpassword=bcrypt.hash(password, 10)
        console.log(hashedpassword)
        const user = new Admin({ name, email,hashedpassword,phone,role });
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
        console.log(error)
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
        const { userId } = req.body;
        await User.findByIdAndUpdate(userId, { isBanned: true });
        res.json({ message: 'User banned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error banning user', error });
    }
};

exports.unbanUser = async (req, res) => {
    try {
        const { userId } = req.body;
        await User.findByIdAndUpdate(userId, { isBanned: false });
        res.json({ message: 'User unbanned successfully' });
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

exports.reviewPost = async (req, res) => {
    try {
        const { postId, status } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.status = status;
        await post.save();

        res.status(200).json({ message: `Post ${status} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error reviewing post' });
    }
};

exports.kycreview= async (req, res) => {
    const { user } = req.body;

    const kyc = await userKYC.findOne({user});
    if (!kyc) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'successfull', kyc });
};

exports.kyc= async (req, res) => {
    const { user, status } = req.body;
    const update = await userKYC.findOne({user});
    if (!update) {
        return res.status(404).json({ error: 'User not found' });
    }

    update.status = status;
    await update.save();

    res.status(200).json({ message: 'KYC updated successfully', update });
};


exports.isBlacklist =  async (req, res) => {
    const { country } = req.body; 
    try {
      let blacklist = await Blacklist.findOne({country});
      if (!blacklist) {
        blacklist = new Blacklist();
      }
      if (!blacklist.countries.includes(country)) {
        blacklist.countries.push(country);
        console.log(country)
        await blacklist.save();
        res.status(200).json({ message: `Country ${country} added to blacklist.`,  blacklist});
      } else {
        res.status(400).json({ message: `Country ${country} is already blacklisted.`,blacklist });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error adding country to blacklist', error });
    }
  };


exports.approveServiceProvider = async (req, res) => {
    const { providerId, approved } = req.body;

    const provider = await Approval.findById(providerId);
    if (!provider) {
        return res.status(404).json({ error: 'Service provider not found' });
    }

    provider.approved = approved;
    await provider.save();

    res.status(200).json({ message: 'Service provider updated successfully', provider });
};

exports.sendNoreplyEmail = async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        await sendEmail(to, subject, body);
        const emailLog = new EmailLog({
            to,
            subject,
            body,
            status: 'success'
        });
        await emailLog.save();

        res.status(200).json({ message: 'Email sent successfully', emailLog });
    } catch (error) {
        console.error('Error sending email:', error);
        const emailLog = new EmailLog({
            to: req.body.to,
            subject: req.body.subject,
            body: req.body.body,
            status: 'failure',
            error: error.message
        });
        await emailLog.save();

        res.status(500).json({ error: 'Error sending email', emailLog });
    }
};

exports.sendEmailToUser = async (req, res) => {
    try {
        const { userId, subject, body } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await sendEmail(user.userId, subject, body);
        const emailLog = new EmailLog({
            to: user.email,
            subject,
            body,
            status: 'success',
            ReadStatus:'Unread'
        });
        await emailLog.save();

        res.status(200).json({ message: 'Email sent successfully to user', emailLog });
    } catch (error) {
        console.error('Error sending email:', error);
        const emailLog = new EmailLog({
            to: req.body.email,
            subject: req.body.subject,
            body: req.body.body,
            status: 'failure',
            error: error.message
        });
        await emailLog.save();

        res.status(500).json({ error: 'Error sending email to user', emailLog });
    }
};


exports.sendEmailToAllUsers = async (req, res) => {
    try {
        const { subject, body } = req.body;
        const users = await User.find({}); 
        const emailPromises = users.map(async (users) => {
            try {
               // await sendEmail(user.UserId, subject, body);
                await new EmailLog({
                    to: users.userId,
                    subject,
                    body,
                    status: 'unread'
                }).save();
            } catch (error) {
                console.error(`Failed to send email to ${users.userId}:`, error);
                await new EmailLog({
                    to: users.userId,
                    subject,
                    body,
                    status: 'failure',
                    error: error.message
                }).save();
            }
        });
        await Promise.all(emailPromises);

        res.status(200).json({ message: 'Emails sent to all users' });
    } catch (error) {
        console.error('Error sending emails to all users:', error);
        res.status(500).json({ error: 'Error sending emails to all users' });
    }
};


exports.Unblacklist= async (req, res) => {
    const { country } = req.body; 
    try {
      const blacklist = await Blacklist.findOne();
      if (blacklist && blacklist.countries.includes(country)) {
        blacklist.countries = blacklist.countries.filter((c) => c !== country);
        await blacklist.save();
        res.status(200).json({ message: `Country ${country} removed from blacklist.` });
      } else {
        res.status(400).json({ message: `Country ${country} is not blacklisted.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error removing country from blacklist', error });
    }
  };

exports.blacklist=async (req, res) => {
    try {
        const{countries}= req.body
      const blacklist = await Blacklist.findOne({countries});
      res.status(200).json({ countries: blacklist ? blacklist.countries : [] });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving blacklist', error });
    }
  };