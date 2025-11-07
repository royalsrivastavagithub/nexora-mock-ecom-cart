const express = require('express');
const { registerUser, loginUser, getMe, updateUserDetails } = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateUserDetails);

module.exports = router;