import * as jose from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

import error from '@/lib/error';
import redis from '@/lib/redis';

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return error('POST requests only', res);
  if (!req.body.phone) return error('Missing phone number', res);
  if (!req.body.username) return error('Missing username', res);
  if (req.body.username.search(/^[a-zA-Z0-9-_]+$/) === -1)
    return error('Username must be alphanumeric', res);

  const jwt = await new jose.SignJWT({
    username: req.body.username,
  })
    .setIssuedAt()
    .setSubject(req.body.username)
    .setIssuer('urn:oinkso:issuer')
    .setAudience('urn:oinkso:audience')
    .setProtectedHeader({ alg: 'RS256' })
    .sign(await jose.importPKCS8(process.env.JWTKEY as string, 'RSA'));

  redis.set(`phone:${req.body.phone}`, req.body.username);
  redis.set(`status:${req.body.username}`, '');

  res.status(200).json({ error: false, token: jwt });
}
