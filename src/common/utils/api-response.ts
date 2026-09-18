import { ApiResponse } from '../api-response-interface';

export const successResponse = <T>(message: string, data?: T, meta?: any): ApiResponse<T> => ({
  success: true,
  message,
  data,
  meta,
});

export const errorResponse = (message: string, error?: any): ApiResponse<null> => ({
  success: false,
  message,
  data: null,
  meta: error,
});
