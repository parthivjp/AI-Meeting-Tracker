const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId) =>
  jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

const deriveAvatar = (name) =>
  (name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar || deriveAvatar(user.name),
  jobTitle: user.jobTitle || '',
  phone: user.phone || '',
  createdAt: user.createdAt,
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: deriveAvatar(name),
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar, jobTitle, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: 'Name cannot be empty' });
      }
      user.name = String(name).trim();
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).toLowerCase().trim();
      if (!normalizedEmail) {
        return res.status(400).json({ message: 'Email cannot be empty' });
      }
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });
      if (existing) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = normalizedEmail;
    }

    if (avatar !== undefined) {
      user.avatar = String(avatar).trim().slice(0, 3).toUpperCase() || deriveAvatar(user.name);
    }

    if (jobTitle !== undefined) {
      user.jobTitle = String(jobTitle).trim();
    }

    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      if (String(newPassword).length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};
