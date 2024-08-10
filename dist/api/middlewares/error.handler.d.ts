import { type Response } from 'express';
export default function errorHandler(err: {
    name: string;
    status: number;
    message: string;
}, res: Response): void;
