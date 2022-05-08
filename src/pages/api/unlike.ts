import * as jose from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

import error from '@/lib/error';
import redis from '@/lib/redis';

export default async function validate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return error('POST requests only', res);
  if (!req.body.like) return error('Missing liked status', res);
  const token = req.headers.authorization;
  if (!token) return error('Missing token', res);
  try {
    const { payload } = await jose.jwtVerify(
      token,
      await jose.importPKCS8(process.env.JWTKEY as string, 'RSA'),
      { issuer: 'urn:oinkso:issuer', audience: 'urn:oinkso:audience' }
    );
    if (!payload) return error('Invalid auth token', res);
    const username = payload.sub;
    await redis.srem(`likes:${req.body.like}`, username);
    res.status(200).json({ error: false });
  } catch (err) {
    return error('Invalid auth token', res);
  }
}
