const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');

const createWorkerProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'worker') {
    const error = new Error('Only workers can create a worker profile');
    error.statusCode = 403;
    throw error;
  }

  const existingProfile = await WorkerProfile.findOne({ userId });
  if (existingProfile) {
    const error = new Error('Worker profile already exists');
    error.statusCode = 400;
    throw error;
  }

  const { skills, location, priceRange } = data;

  if (!skills || skills.length === 0) {
    const error = new Error('At least one skill is required');
    error.statusCode = 400;
    throw error;
  }

  if (priceRange.min < 0 || priceRange.max < 0) {
    const error = new Error('Price range values must be greater than or equal to 0');
    error.statusCode = 400;
    throw error;
  }

  const profile = await WorkerProfile.create({
    userId,
    skills,
    location: location.trim(),
    priceRange: {
      min: priceRange.min,
      max: priceRange.max,
    },
  });

  return profile;
};

const updateWorkerProfile = async (userId, profileId, data) => {
  const profile = await WorkerProfile.findById(profileId);
  if (!profile) {
    const error = new Error('Worker profile not found');
    error.statusCode = 404;
    throw error;
  }

  if (profile.userId.toString() !== userId) {
    const error = new Error('Not authorized to update this profile');
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = ['skills', 'location', 'priceRange', 'availability'];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (updateData.skills && updateData.skills.length === 0) {
    const error = new Error('At least one skill is required');
    error.statusCode = 400;
    throw error;
  }

  if (updateData.priceRange) {
    if (updateData.priceRange.min < 0 || updateData.priceRange.max < 0) {
      const error = new Error('Price range values must be greater than or equal to 0');
      error.statusCode = 400;
      throw error;
    }
  }

  if (updateData.location) {
    updateData.location = updateData.location.trim();
  }

  const updatedProfile = await WorkerProfile.findByIdAndUpdate(
    profileId,
    updateData,
    { new: true, runValidators: true }
  );

  return updatedProfile;
};

const getWorkers = async (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.skill) {
    filter.skills = { $regex: query.skill.trim(), $options: 'i' };
  }

  if (query.location) {
    filter.location = { $regex: query.location.trim(), $options: 'i' };
  }

  const workers = await WorkerProfile.find(filter)
    .populate('userId', 'name email')
    .skip(skip)
    .limit(limit);

  const total = await WorkerProfile.countDocuments(filter);

  return {
    workers,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

const getWorkerById = async (id) => {
  const profile = await WorkerProfile.findById(id).populate('userId', 'name email');
  if (!profile) {
    const error = new Error('Worker profile not found');
    error.statusCode = 404;
    throw error;
  }

  return profile;
};

module.exports = {
  createWorkerProfile,
  updateWorkerProfile,
  getWorkers,
  getWorkerById,
};
