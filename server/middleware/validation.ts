import { NextFunction, Request, Response } from 'express'

export const validateMapId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  if (!id || typeof id !== 'string') {
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
  const { id } = req.params
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      error: {
        code: 'INVALID_LINEUP_ID',
        message: 'Invalid lineup ID provided',
      },
    })
  }
  next()
}