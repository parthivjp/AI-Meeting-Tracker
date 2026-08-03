const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getActionItems,
  createActionItem,
  updateActionItem,
  deleteActionItem,
  getDashboardStats,
} = require('../controllers/actionController');

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', getDashboardStats);
router.get('/', getActionItems);
router.post('/', createActionItem);
router.put('/:id', updateActionItem);
router.delete('/:id', deleteActionItem);

module.exports = router;
