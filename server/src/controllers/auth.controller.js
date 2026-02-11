const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({ email, password });

    req.session.userId = user.id;

    res.status(201).json({
      id: user.id,
      email: user.email,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Use Google/GitHub login for this account' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    req.session.userId = user.id;

    res.json({
      id: user.id,
      email: user.email,
      message: 'Logged in successfully',
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
};

exports.me = async (req, res) => {
  try {
    console.log("Session in /me:", req.session);

    if (!req.session || !req.session.userId) {
      return res.status(401).json({ user: null });
    }

    const user = await User.findByPk(req.session.userId);

    if (!user) {
      return res.status(401).json({ user: null });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('/me error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
