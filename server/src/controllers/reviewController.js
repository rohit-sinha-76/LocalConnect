const { createReview, getWorkerReviews } = require('../services/reviewService');

const createReviewHandler = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'bookingId and rating are required',
      });
    }

    const review = await createReview(req.user.id, {
      bookingId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const getWorkerReviewsHandler = async (req, res) => {
  try {
    const reviews = await getWorkerReviews(req.params.workerId);

    res.status(200).json({
      success: true,
      data: reviews,
      message: 'Worker reviews fetched',
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
  createReview: createReviewHandler,
  getWorkerReviews: getWorkerReviewsHandler,
};
