const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const {
  createBooking,
  acceptBooking,
  cancelBooking,
  completeBooking,
  getUserBookings,
  getWorkerBookings,
} = require('../controllers/bookingController');

router.post('/', verifyToken, checkRole(['customer']), createBooking);
router.get('/user', verifyToken, checkRole(['customer']), getUserBookings);
router.get('/worker', verifyToken, checkRole(['worker']), getWorkerBookings);
router.patch('/:id/accept', verifyToken, checkRole(['worker']), acceptBooking);
router.patch('/:id/cancel', verifyToken, cancelBooking);
router.patch('/:id/complete', verifyToken, checkRole(['worker']), completeBooking);

module.exports = router;
