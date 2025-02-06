require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const conversationRoutes = require('./routes/conversationRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(bodyParser.json());
app.use(cors)
// MongoDB Connection
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); 
    }
};
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

connectToDatabase();


//  io

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });
  
    socket.on('sendMessage', (data) => {
      const { conversationId, message } = data;
      io.to(conversationId).emit('receiveMessage', message);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

// Routes
app.use('/admin',require('./routes/adminRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/services', require('./routes/serviceRoutes'));
app.use('/wallet', require('./routes/walletRoutes'));
app.use('/referralChallenge', require('./routes/challengeRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/transactions', require('./routes/transactionRoutes'));
app.use('/community', require('./routes/communityRoutes'));
app.use('/product', require('./routes/productRoutes'));
app.use('/subService',require('./routes/subservice'));
app.use('/conversations', conversationRoutes);
app.use('/chats', chatRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
