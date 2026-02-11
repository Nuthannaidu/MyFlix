const protect = (req, res, next) => {
  try {
    // Passport automatically adds isAuthenticated() to the request object
    if (req.isAuthenticated()) {
      return next();
    }

    // Fallback check for manual session assignment
    if (req.session && req.session.userId) {
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please login.',
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication middleware',
    });
  }
};

module.exports = { protect };