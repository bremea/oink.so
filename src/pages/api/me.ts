import * as jose from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

import error from '@/lib/error';
import redis from '@/lib/redis';

export default async function me(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  if (!token) return error('Missing token', res);
  try {
    const username = jose.decodeJwt(token).username as string;
    const status = await redis.get(`status:${username}`);
    if (status === undefined || status === null)
      return error('Invalid auth token', res);
    res.status(200).json({ error: false, username: username, status: status });
  } catch (err) {
    return error('Invalid auth token', res);
  }
}
