const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerProfile',
      required: true,
      index: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    timeSlot: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'EXPIRED'],
      default: 'PENDING',
      required: true,
    },
    cancelReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ workerId: 1, 'timeSlot.start': 1 });
bookingSchema.index({ userId: 1, workerId: 1, 'timeSlot.start': 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
