const protect = (req, res, next) => {
  // Check if a session exists and has a user property
  if (req.session && req.session.user) {
    next(); // User is logged in, proceed!
  } else {
    res.status(401);
    throw new Error('Not authorized, please login');
  }
};

module.exports = { protect };