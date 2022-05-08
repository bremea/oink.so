import * as jose from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

import error from '@/lib/error';
import redis from '@/lib/redis';

export default async function validate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return error('POST requests only', res);
  if (!req.body.phone) return error('Missing phone number', res);
  if (!req.body.code) return error('Missing code', res);

  const correctCode = await redis.get(`verify:${req.body.phone}`);
  if (!correctCode || correctCode != req.body.code)
    return error('Incorrect code', res);

  await redis.set(`verification:${req.body.phone}`, true);

  const username = await redis.get(`phone:${req.body.phone}`);
  if (!username) return res.status(200).json({ error: false });

  const jwt = await new jose.SignJWT({
    username: req.body.username,
  })
    .setProtectedHeader({ alg: 'RS256' })
    .sign(await jose.importPKCS8(process.env.JWTKEY as string, 'RSA'));

  res
    .status(200)
    .json({ error: false, token: jwt, key: process.env.JWTKEY as string });
}
