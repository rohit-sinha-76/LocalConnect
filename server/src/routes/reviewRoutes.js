const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { createReview, getWorkerReviews } = require('../controllers/reviewController');

router.post('/', verifyToken, checkRole(['customer']), createReview);
router.get('/worker/:workerId', getWorkerReviews);

module.exports = router;
