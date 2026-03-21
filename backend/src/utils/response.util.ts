import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, data: any = null, message: string = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res: Response, statusCode: number, error: string) => {
  return res.status(statusCode).json({
    success: false,
    error
  });
};
