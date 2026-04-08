const {
  createBooking,
  acceptBooking,
  cancelBooking,
  completeBooking,
  getUserBookings,
  getWorkerBookings,
} = require('../services/bookingService');

const createBookingHandler = async (req, res) => {
  try {
    const { workerId, service, timeSlot } = req.body;

    if (!workerId || !service || !timeSlot) {
      return res.status(400).json({
        success: false,
        error: 'workerId, service, and timeSlot are required',
      });
    }

    const booking = await createBooking(req.user.id, {
      workerId,
      service,
      timeSlot,
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created (pending)',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const acceptBookingHandler = async (req, res) => {
  try {
    const booking = await acceptBooking(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking accepted',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const cancelBookingHandler = async (req, res) => {
  try {
    const { cancelReason } = req.body;

    const booking = await cancelBooking(
      req.user.id,
      req.user.role,
      req.params.id,
      cancelReason
    );

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const completeBookingHandler = async (req, res) => {
  try {
    const booking = await completeBooking(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking completed',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const getUserBookingsHandler = async (req, res) => {
  try {
    const bookings = await getUserBookings(req.user.id);

    res.status(200).json({
      success: true,
      data: bookings,
      message: 'User bookings fetched',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const getWorkerBookingsHandler = async (req, res) => {
  try {
    const bookings = await getWorkerBookings(req.user.id);

    res.status(200).json({
      success: true,
      data: bookings,
      message: 'Worker bookings fetched',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createBooking: createBookingHandler,
  acceptBooking: acceptBookingHandler,
  cancelBooking: cancelBookingHandler,
  completeBooking: completeBookingHandler,
  getUserBookings: getUserBookingsHandler,
  getWorkerBookings: getWorkerBookingsHandler,
};
