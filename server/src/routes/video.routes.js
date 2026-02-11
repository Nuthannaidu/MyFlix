const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const { protect } = require('../middleware/auth.middleware'); 


router.get('/', videoController.getAllVideos);
router.get('/:id', protect,videoController.getVideoById);

module.exports = router;
