import { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)

  // Default error response
  const errorResponse = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    },
  }

  // Return appropriate error based on error type
  if (err.name === 'ApiError') {
    res.status(400).json({
      error: {
        code: err.message,
        message: err.message,
      },
    })
  } else {
    // For unhandled errors, send generic error
    res.status(500).json(errorResponse)
  }
}