import { type ResponseI } from './interface';

export const sendSuccessResponse = (message: string, payload: any = {}, statusCode: number = 200): ResponseI => ({
  success: true,
  payload,
  message,
  statusCode,
});

export const sendFailedResponse = (message: string, payload: any = {}, statusCode: number = 400): ResponseI => ({
  success: false,
  payload,
  message,
  statusCode,
});
