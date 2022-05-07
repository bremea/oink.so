import { NextApiRequest, NextApiResponse } from 'next';

import error from '@/lib/error';

export default function getspace(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  if (req.method !== 'POST') return error('POST requests only', res);
  if (!req.body.username) return error('Missing username', res);
  if (!req.body.password) return error('Missing password', res);

  res.status(200).json({ id: id });
}
