import { ErrorRequestHandler } from 'express'

// Standard error response format - consistent with plan_update.md requirements
const createErrorResponse = (code: string, message: string) => ({
  error: {
    code,
    message
  }
});

// Custom ApiError class for consistent error handling
class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)

  // Handle our custom API errors
  if (err.name === 'ApiError') {
    // For API validation errors, return 400
    res.status(400).json(createErrorResponse(err.code, err.message));
  } else {
    // For unexpected server errors, return 500 with appropriate codes
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Internal server error'));
  }
}

// Export the ApiError class for use elsewhere
export { ApiError };