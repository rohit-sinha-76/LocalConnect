const mongoose = require('mongoose');
const User = require('../src/models/User');
const WorkerProfile = require('../src/models/WorkerProfile');
const Booking = require('../src/models/Booking');
const Review = require('../src/models/Review');

const connectTestDB = async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI or MONGO_URI_TEST environment variable is required for tests');
  }

  await mongoose.connect(uri);
};

const disconnectTestDB = async () => {
  await mongoose.disconnect();
};

const clearCollections = async () => {
  await User.deleteMany({});
  await WorkerProfile.deleteMany({});
  await Booking.deleteMany({});
  await Review.deleteMany({});
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearCollections,
};
