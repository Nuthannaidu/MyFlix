const protect = (req, res, next) => {
  try {
    if (!req.session) {
      return res.status(401).json({
        success: false,
        message: 'No session found. Please login.',
      });
    }
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.',
      });
    }
    req.userId = req.session.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication middleware',
    });
  }
};

module.exports = { protect };
