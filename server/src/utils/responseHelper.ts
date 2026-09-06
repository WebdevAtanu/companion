import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  error: any = null,
  statusCode: number = 500,
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    ...(error && { error }),
  };

  return res.status(statusCode).json(response);
};
