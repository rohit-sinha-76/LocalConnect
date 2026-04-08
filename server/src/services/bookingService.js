const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');

const BOOKING_EXPIRY_MINUTES = 30;

const VALID_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED', 'EXPIRED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
};

const createBooking = async (userId, data) => {
  const { workerId, service, timeSlot } = data;

  if (!workerId || !service || !timeSlot || !timeSlot.start || !timeSlot.end) {
    const error = new Error('workerId, service, and timeSlot with start and end are required');
    error.statusCode = 400;
    throw error;
  }

  const start = new Date(timeSlot.start);
  const end = new Date(timeSlot.end);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    const error = new Error('Invalid date format');
    error.statusCode = 400;
    throw error;
  }

  if (start >= end) {
    const error = new Error('timeSlot start must be before end');
    error.statusCode = 400;
    throw error;
  }

  if (start < new Date()) {
    const error = new Error('Cannot book a time slot in the past');
    error.statusCode = 400;
    throw error;
  }

  const workerProfile = await WorkerProfile.findById(workerId);
  if (!workerProfile) {
    const error = new Error('Worker profile not found');
    error.statusCode = 404;
    throw error;
  }

  if (userId === workerProfile.userId.toString()) {
    const error = new Error('Cannot create a booking for your own profile');
    error.statusCode = 400;
    throw error;
  }

  const duplicateBooking = await Booking.findOne({
    userId,
    workerId,
    'timeSlot.start': start,
  });

  if (duplicateBooking) {
    const error = new Error('Duplicate booking request');
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.create({
    userId,
    workerId,
    service: service.trim(),
    timeSlot: {
      start,
      end,
    },
    status: 'PENDING',
  });

  console.log(`[Booking] Created: ${booking._id} | User: ${userId} | Worker: ${workerId}`);

  return booking;
};

const checkOverlap = async (workerId, start, end) => {
  const overlappingBooking = await Booking.findOne({
    workerId,
    status: 'CONFIRMED',
    $or: [
      {
        'timeSlot.start': { $lt: end },
        'timeSlot.end': { $gt: start },
      },
    ],
  });

  return overlappingBooking !== null;
};

const acceptBooking = async (workerId, bookingId) => {
  const booking = await Booking.findById(bookingId).populate('workerId', 'userId');
  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  if (booking.workerId.userId.toString() !== workerId) {
    const error = new Error('Not authorized to accept this booking');
    error.statusCode = 403;
    throw error;
  }

  if (booking.status !== 'PENDING') {
    const error = new Error('Booking cannot be accepted from current status');
    error.statusCode = 400;
    throw error;
  }

  const hasOverlap = await checkOverlap(
    booking.workerId._id,
    booking.timeSlot.start,
    booking.timeSlot.end
  );

  if (hasOverlap) {
    const error = new Error('Time slot conflicts with another confirmed booking');
    error.statusCode = 400;
    throw error;
  }

  booking.status = 'CONFIRMED';
  await booking.save();

  console.log(`[Booking] Accepted: ${booking._id} | Worker: ${workerId}`);

  return booking;
};

const cancelBooking = async (userId, userRole, bookingId, reason) => {
  const booking = await Booking.findById(bookingId).populate('workerId', 'userId');
  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  const isCustomer = userRole === 'customer' && booking.userId.toString() === userId;
  const isWorker = userRole === 'worker' && booking.workerId.userId.toString() === userId;

  if (!isCustomer && !isWorker) {
    const error = new Error('Not authorized to cancel this booking');
    error.statusCode = 403;
    throw error;
  }

  if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
    const error = new Error('Only PENDING or CONFIRMED bookings can be cancelled');
    error.statusCode = 400;
    throw error;
  }

  booking.status = 'CANCELLED';
  booking.cancelReason = reason ? reason.trim() : null;
  await booking.save();

  return booking;
};

const completeBooking = async (workerId, bookingId) => {
  const booking = await Booking.findById(bookingId).populate('workerId', 'userId');
  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  if (booking.workerId.userId.toString() !== workerId) {
    const error = new Error('Not authorized to complete this booking');
    error.statusCode = 403;
    throw error;
  }

  if (booking.status !== 'CONFIRMED') {
    const error = new Error('Only confirmed bookings can be completed');
    error.statusCode = 400;
    throw error;
  }

  booking.status = 'COMPLETED';
  await booking.save();

  return booking;
};

const expireBookings = async () => {
  const expiryThreshold = new Date(Date.now() - BOOKING_EXPIRY_MINUTES * 60 * 1000);

  const result = await Booking.updateMany(
    {
      status: 'PENDING',
      createdAt: { $lt: expiryThreshold },
    },
    {
      status: 'EXPIRED',
    }
  );

  return result;
};

const getUserBookings = async (userId) => {
  const bookings = await Booking.find({ userId })
    .populate('workerId', 'skills location rating')
    .sort({ createdAt: -1 });

  return bookings;
};

const getWorkerBookings = async (workerId) => {
  const workerProfile = await WorkerProfile.findOne({ userId: workerId });
  if (!workerProfile) {
    return [];
  }

  const bookings = await Booking.find({ workerId: workerProfile._id })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  return bookings;
};

module.exports = {
  createBooking,
  checkOverlap,
  acceptBooking,
  cancelBooking,
  completeBooking,
  expireBookings,
  getUserBookings,
  getWorkerBookings,
};
