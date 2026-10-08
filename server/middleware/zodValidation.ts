import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from './errorHandler';

// Schema for map ID validation
export const mapIdSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, "Map ID must be a positive integer")
});

// Schema for lineup ID validation  
export const lineupIdSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, "Lineup ID must be a positive integer")
});

// Schema for query parameters
export const querySchema = z.object({
  side: z.enum(['T', 'CT']).optional(),
  grenade_type: z.enum(['smoke', 'flash', 'molotov', 'he']).optional(),
  target: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30)
});

// Middleware to validate map ID
export const validateMapId = (req: Request, res: Response, next: NextFunction) => {
  try {
    mapIdSchema.parse({ id: req.params.id });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors with the new standard
      return res.status(400).json({
        error: {
          code: 'INVALID_MAP_ID',
          message: 'Invalid map ID provided',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }
      });
    }
    // Catch any unexpected errors
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error during validation'
      }
    });
  }
};

// Middleware to validate lineup ID
export const validateLineupId = (req: Request, res: Response, next: NextFunction) => {
  try {
    lineupIdSchema.parse({ id: req.params.id });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors with the new standard
      return res.status(400).json({
        error: {
          code: 'INVALID_LINEUP_ID',
          message: 'Invalid lineup ID provided',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }
      });
    }
    // Catch any unexpected errors
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error during validation'
      }
    });
  }
};

// Middleware to validate query parameters
export const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    querySchema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors with the new standard
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid query parameters provided',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }
      });
    }
    // Catch any unexpected errors
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error during validation'
      }
    });
  }
};