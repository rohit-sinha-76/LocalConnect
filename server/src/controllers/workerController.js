const {
  createWorkerProfile,
  updateWorkerProfile,
  getWorkers,
  getWorkerById,
} = require('../services/workerService');

const createWorker = async (req, res) => {
  try {
    const { skills, location, priceRange } = req.body;

    if (!skills || !location || !priceRange) {
      return res.status(400).json({
        success: false,
        error: 'Skills, location, and priceRange are required',
      });
    }

    if (!priceRange.min && priceRange.min !== 0 || !priceRange.max && priceRange.max !== 0) {
      return res.status(400).json({
        success: false,
        error: 'Price range must include min and max values',
      });
    }

    const profile = await createWorkerProfile(req.user.id, {
      skills,
      location,
      priceRange,
    });

    res.status(201).json({
      success: true,
      data: profile,
      message: 'Worker profile created',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const updateWorker = async (req, res) => {
  try {
    const profile = await updateWorkerProfile(req.user.id, req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Worker profile updated',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllWorkers = async (req, res) => {
  try {
    const result = await getWorkers(req.query);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Workers fetched',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const getOneWorker = async (req, res) => {
  try {
    const profile = await getWorkerById(req.params.id);

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Worker profile fetched',
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
  createWorker,
  updateWorker,
  getWorkers: getAllWorkers,
  getWorkerById: getOneWorker,
};
