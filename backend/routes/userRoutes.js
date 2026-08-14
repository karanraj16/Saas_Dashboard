const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const { registerUser,loginUser,getUserProfile,updateProfilePhoto} = require('../controllers/userController');
const { upload } = require('../config/cloudinary');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile/photo', protect, upload.single('image'), updateProfilePhoto);

module.exports = router;