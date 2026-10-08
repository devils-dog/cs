import { NextFunction, Request, Response } from 'express'

// Keep the old functions for compatibility but note they're deprecated
// We're mainly using zodValidation.ts now

export const validateMapId = (req: Request, res: Response, next: NextFunction) => {
  console.warn('WARNING: validateMapId is deprecated. Please use zodValidation instead');
  const { id } = req.params
  if (!id || typeof id !== 'string' || isNaN(Number(id))) {
    return res.status(400).json({
      error: {
        code: 'INVALID_MAP_ID',
        message: 'Invalid map ID provided',
      },
    })
  }
  next()
}

export const validateLineupId = (req: Request, res: Response, next: NextFunction) => {
  console.warn('WARNING: validateLineupId is deprecated. Please use zodValidation instead');
  const { id } = req.params
  if (!id || typeof id !== 'string' || isNaN(Number(id))) {
    return res.status(400).json({
      error: {
        code: 'INVALID_LINEUP_ID',
        message: 'Invalid lineup ID provided',
      },
    })
  }
  next()
}