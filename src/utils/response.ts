// utils/response.ts
import { Response } from 'express';

type ResponsePayload = {
  status: boolean;
  message: string;
  data?: any;
  errors?: { [key: string]: string }[] | string[];
  token?: string;
  user?: any;
  count?: any;
  page?: any;
  limit?: any;
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  payload: ResponsePayload
): void => {
  res.status(statusCode).json({
    status: payload.status,
    message: payload.message,
    ...(payload.data && { data: payload.data }),
    ...(payload.errors && { errors: payload.errors }),
    ...(payload.token && { token: payload.token }),
    ...(payload.user && { user: payload.user }),
    ...(payload.count && { total: payload.count }),
    ...(payload.page && { total: payload.page }),
    ...(payload.limit && { total: payload.limit }),
  });
};
