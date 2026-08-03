const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/authController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getProfile);
router.put('/', updateProfile);

module.exports = router;
