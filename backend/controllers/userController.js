const { validationResult } = require('express-validator');
const User = require('../models/User');
const Cart = require('../models/Cart');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mergeCarts = async (userId, sessionId) => {
  const guestCart = await Cart.findOne({ sessionId });
  if (!guestCart) {
    return;
  }

  let userCart = await Cart.findOne({ userId });

  if (!userCart) {
    // If user has no cart, just assign the guest cart to the user
    guestCart.userId = userId;
    guestCart.sessionId = null;
    await guestCart.save();
    return;
  }

  // Merge items
  for (const guestItem of guestCart.items) {
    const userItemIndex = userCart.items.findIndex(
      (item) => item.productId.toString() === guestItem.productId.toString()
    );

    if (userItemIndex > -1) {
      // Update quantity if item exists
      userCart.items[userItemIndex].qty += guestItem.qty;
    } else {
      // Add new item
      userCart.items.push(guestItem);
    }
  }

  await userCart.save();
  await Cart.findByIdAndDelete(guestCart._id);
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, address } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      passwordHash,
      address,
    });

    await user.save();

    await mergeCarts(user._id, req.sessionId);

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    await mergeCarts(user._id, req.sessionId);

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authorized, no user found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateUserDetails = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being updated and if the new email is already taken
    if (req.body.email && req.body.email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = req.body.email.toLowerCase();
    }

    if (typeof req.body.address !== 'undefined') {
      user.address = req.body.address;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      address: updatedUser.address,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getMe, updateUserDetails };