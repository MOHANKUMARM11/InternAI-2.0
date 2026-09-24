export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal server error'
  console.error(err); res.status(statusCode).json({ success: false, error: message })
}
