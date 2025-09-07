// CSRF protection disabled - using dummy middleware
const csrfProtection = (req, res, next) => next();
const csrfErrorHandler = (err, req, res, next) => next(err);

module.exports = { csrfProtection, csrfErrorHandler };