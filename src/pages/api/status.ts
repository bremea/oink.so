import * as jose from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

import error from '@/lib/error';
import redis from '@/lib/redis';

export default async function validate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return error('POST requests only', res);
  if (!req.body.status) return error('Missing status', res);
  if (req.body.status.length > 200) return error('Status too long', res);
  const token = req.headers.authorization;
  if (!token) return error('Missing token', res);
  try {
    const username = jose.decodeJwt(token).username as string;
    const status = await redis.get(`status:${username}`);
    if (status === undefined || status === null)
      return error('Invalid auth token', res);
    await redis.set(`status:${username}`, req.body.status);
    res.status(200).json({ error: false });
  } catch (err) {
    return error('Invalid auth token', res);
  }
}
