const Review = require('../models/Review');
const Booking = require('../models/Booking');
const WorkerProfile = require('../models/WorkerProfile');

const createReview = async (userId, data) => {
  const { bookingId, rating, comment } = data;

  if (!bookingId || !rating) {
    const error = new Error('bookingId and rating are required');
    error.statusCode = 400;
    throw error;
  }

  if (rating < 1 || rating > 5) {
    const error = new Error('Rating must be between 1 and 5');
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  if (booking.userId.toString() !== userId) {
    const error = new Error('You can only review your own bookings');
    error.statusCode = 403;
    throw error;
  }

  if (booking.status !== 'COMPLETED') {
    const error = new Error('Only completed bookings can be reviewed');
    error.statusCode = 400;
    throw error;
  }

  const existingReview = await Review.findOne({ bookingId });
  if (existingReview) {
    const error = new Error('Booking has already been reviewed');
    error.statusCode = 400;
    throw error;
  }

  const review = await Review.create({
    userId,
    workerId: booking.workerId,
    bookingId,
    rating,
    comment: comment ? comment.trim() : '',
  });

  await updateWorkerRating(booking.workerId, rating);

  return review;
};

const updateWorkerRating = async (workerId, newRating) => {
  const workerProfile = await WorkerProfile.findById(workerId);
  if (!workerProfile) {
    return;
  }

  workerProfile.totalReviews += 1;
  workerProfile.totalRatingSum += newRating;
  workerProfile.rating = workerProfile.totalRatingSum / workerProfile.totalReviews;

  await workerProfile.save();

  return workerProfile;
};

const getWorkerReviews = async (workerId) => {
  const reviews = await Review.find({ workerId })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });

  return reviews;
};

module.exports = {
  createReview,
  updateWorkerRating,
  getWorkerReviews,
};
