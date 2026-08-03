const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} = require('../controllers/meetingController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMeetings);
router.get('/:id', getMeetingById);
router.post('/', createMeeting);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);

module.exports = router;
