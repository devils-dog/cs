import { ErrorRequestHandler } from 'express'

// Standard error response format
const createErrorResponse = (code: string, message: string, details?: any) => ({
  error: {
    code,
    message,
    ...(details && { details })
  }
});

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)

  // Generic internal server error
  const internalError = createErrorResponse('INTERNAL_ERROR', 'Internal server error');

  // Return appropriate error based on error type
  if (err.name === 'ApiError') {
    res.status(400).json(createErrorResponse(err.message, err.message));
  } else {
    // For unhandled errors, send generic error (this won't be reached in our current setup)
    res.status(500).json(internalError);
  }
}