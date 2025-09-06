const csrf = require('csurf');

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ 
      message: 'Invalid CSRF token',
      error: 'CSRF_TOKEN_INVALID'
    });
  } else {
    next(err);
  }
};

module.exports = { csrfProtection, csrfErrorHandler };