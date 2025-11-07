
const { check } = require('express-validator');

const registerValidation = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 8 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/),
  check('address', 'Address is required').not().isEmpty(),
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

module.exports = { registerValidation, loginValidation };
