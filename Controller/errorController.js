const sendErrorDev = (err, req, res, nex) => {
  if (req.originalUrl.startsWith("/api"))
    res.status(err.statuscode || 500).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
};
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV == "development") sendErrorDev(err, req, res);
}