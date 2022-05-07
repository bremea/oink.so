import { NextApiResponse } from 'next';

const error = (message: string, res: NextApiResponse, code?: number) => {
  if (!code) code = 403;
  return res.status(code).json({ error: true, message: message });
};

export default error;
