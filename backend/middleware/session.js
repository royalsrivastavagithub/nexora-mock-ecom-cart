const { v4: uuidv4 } = require('uuid');

const sessionMiddleware = (req, res, next) => {
  let sessionId = req.cookies.cart_session;
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie('cart_session', sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'Lax'
    });
  }
  req.sessionId = sessionId;
  next();
};

module.exports = sessionMiddleware;
