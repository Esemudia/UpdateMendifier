
const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  countries: {
    type: [String], // ISO codes like "NG", "US"
    required: true,
    default: [],
  },
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
