import { Response } from "express";

// Generic API Response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

// Success Response
export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error Response
export const errorResponse = (
  res: Response,
  message: string,
  error: any = null,
  statusCode: number = 500,
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error,
  };

  return res.status(statusCode).json(response);
};
