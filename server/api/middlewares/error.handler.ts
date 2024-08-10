import { type Response } from 'express';

// Error handler to display the error as HTML
// eslint-disable-next-line no-unused-vars, no-shadow
export default function errorHandler(err: { name: string; status: number; message: string }, res: Response): void {
  if (typeof err === 'string') {
    res.status(400).json({ message: err });
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid Token' });
  }
  // default to 500 server error
  res.status(err.status);
  res.send(`<h1>${err.status} Error</h1>` + `<pre>${err.message}</pre>`);
}
