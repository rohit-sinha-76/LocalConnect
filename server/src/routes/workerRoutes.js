const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const {
  createWorker,
  updateWorker,
  getWorkers,
  getWorkerById,
} = require('../controllers/workerController');

router.post('/', verifyToken, checkRole(['worker']), createWorker);
router.get('/', getWorkers);
router.get('/:id', getWorkerById);
router.patch('/:id', verifyToken, updateWorker);

module.exports = router;
