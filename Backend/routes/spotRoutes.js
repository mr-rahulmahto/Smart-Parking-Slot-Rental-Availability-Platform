const express = require('express');
const router = express.Router();
const {
  getSpots,
  getSpotById,
  createSpot,
  updateSpotStatus,
  deleteSpot,
} = require('../controllers/spotController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.route('/').get(getSpots).post(protect, requireAdmin, createSpot);
router.route('/:id').get(getSpotById).delete(protect, requireAdmin, deleteSpot);
router.patch('/:id/status', protect, requireAdmin, updateSpotStatus);

module.exports = router;
