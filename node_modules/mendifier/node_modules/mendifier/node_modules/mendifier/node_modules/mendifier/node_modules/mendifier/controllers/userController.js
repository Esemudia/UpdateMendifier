const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const twilio = require('twilio');
const multer = require('multer');
const kyc = require('../models/kyc');
const number="+14155238886"
const Collaboration = require('../models/collaborationModel');
const Customer = require('../models/customerModel');
const Review = require('../models/reviewModel.js')
require('dotenv').config()


const twilioClient = twilio('AC04bd7aae1f82d8a5dc384e24b6ac04de', process.env.Twillio_token );
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
        res.status(200).json({message:'File uploaded and saved to database'});
      } catch (error) {
        console.log(error)
        res.status(500).send('Error uploading file', error);
      }
}
exports.uploadpics= async (req,res)=>{
    try {
        const {userId}= req.body
        const user = await User.findById(userId);
        if(!user)
        {
            return res.status(404).json({ error: 'User not found' }); 
        }
          user.filename= req.file.filename,
          user.profile=req.file.path,
        await user.save();
        res.status(200).json({message:'File uploaded and saved to database', user});
      } catch (error) {
        console.log(error)
        res.status(500).send('Error uploading file', error);
      }
}
exports.searchService=async (req, res) => {
    try {
      const { service, location, minRating } = req.query;
      const query = {};
      if (service) query.jobtitle = { $regex: service, $options: 'i' };
      if (location) query.city = { $regex: location, $options: 'i' };
      if (minRating) query.rating = { $gte: parseFloat(minRating) };
  
      const providers = await User.find(query);
      res.status(200).json({message:"sucessful",providers});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving service providers' });
    }
}
exports.followVendor = async (req, res) => {
    const { userId, vendorId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const vendor = await User.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      user.followedVendors.push(vendorId);
      await user.save();
  
      res.status(200).json({ message: 'Vendor followed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error following vendor' });
    }
};

exports.requestCollaboration = async (req, res) => {
    const { vendorId, targetVendorId } = req.body;
  
    try {
      const vendor = await Vendor.findById(vendorId);
      const targetVendor = await Vendor.findById(targetVendorId);
  
      if (!vendor || !targetVendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
  
      const collaboration = new Collaboration({ vendor1: vendorId, vendor2: targetVendorId });
      await collaboration.save();
  
      res.status(200).json({ message: 'Collaboration request sent', collaboration });
    } catch (error) {
      res.status(500).json({ message: 'Error requesting collaboration' });
    }
  };
  
  // Accept Collaboration
  exports.acceptCollaboration = async (req, res) => {
    const { collaborationId } = req.body;
  
    try {
      const collaboration = await Collaboration.findById(collaborationId);
      if (!collaboration) {
        return res.status(404).json({ message: 'Collaboration not found' });
      }
  
      collaboration.status = 'accepted';
      await collaboration.save();
  
      res.status(200).json({ message: 'Collaboration accepted' });
    } catch (error) {
      res.status(500).json({ message: 'Error accepting collaboration' });
    }
  };

  // Get all customers for a vendor
exports.getCustomers = async (req, res) => {
    try {
      const { vendorId } = req.params;
      const customers = await Customer.find({ vendor: vendorId }).populate('user', 'name email');
  
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customers' });
    }
  };
  
  // Add a customer to a vendor
  exports.addCustomer = async (req, res) => {
    const { vendorId, userId } = req.body;
  
    try {
      const newCustomer = new Customer({ user: userId, vendor: vendorId });
      await newCustomer.save();
  
      await Vendor.findByIdAndUpdate(vendorId, { $push: { customers: newCustomer._id } });
  
      res.status(201).json({ message: 'Customer added successfully', newCustomer });
    } catch (error) {
      res.status(500).json({ message: 'Error adding customer' });
    }
  };
  
  // Block or Unblock a customer
  exports.updateCustomerStatus = async (req, res) => {
    const { customerId, status } = req.body;
  
    try {
      const customer = await Customer.findByIdAndUpdate(customerId, { status }, { new: true });
  
      res.status(200).json({ message: `Customer ${status}`, customer });
    } catch (error) {
      res.status(500).json({ message: 'Error updating customer status' });
    }
  };
  
  // Remove a customer
  exports.removeCustomer = async (req, res) => {
    const { customerId, vendorId } = req.body;
  
    try {
      await Customer.findByIdAndDelete(customerId);
      await Vendor.findByIdAndUpdate(vendorId, { $pull: { customers: customerId } });
  
      res.status(200).json({ message: 'Customer removed' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing customer' });
    }
  };


  // Get all vendors (with optional category filter)
exports.getVendors = async (req, res) => {
    try {
      const { category } = req.query;
      const query = category ? { category } : {};
      const vendors = await Vendor.find(query).populate('reviews');
  
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vendors' });
    }
  };
  
  // Get vendor details
  exports.getVendorDetails = async (req, res) => {
    try {
      const { vendorId } = req.params;
      const vendor = await Vendor.findById(vendorId).populate('reviews');
  
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
  
      res.status(200).json(vendor);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vendor details' });
    }
  };

  // Add a review for a vendor
exports.addReview = async (req, res) => {
    try {
      const { vendorId, user, rating, comment } = req.body;
  
      const newReview = new Review({
        vendor: vendorId,
        user,
        rating,
        comment
      });
  
      await newReview.save();
      await Vendor.findByIdAndUpdate(vendorId, { $push: { reviews: newReview._id } });
  
      res.status(201).json({ message: 'Review added successfully', newReview });
    } catch (error) {
      res.status(500).json({ message: 'Error adding review' });
    }
  };