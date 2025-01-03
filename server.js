require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
};

// Listen for connection events
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Call the connection function
connectToDatabase();

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/services', require('./routes/serviceRoutes'));
app.use('/wallet', require('./routes/walletRoutes'));
app.use('/referrals', require('./routes/referralRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/transactions', require('./routes/transactionRoutes'));
app.use('/community', require('./routes/communityRoutes'));


// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
