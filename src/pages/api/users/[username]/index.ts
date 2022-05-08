import * as jose from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

import redis from '@/lib/redis';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization as string;
  let myusername: string | undefined = undefined;
  try {
    const { payload } = await jose.jwtVerify(
      token,
      await jose.importPKCS8(process.env.JWTKEY as string, 'RSA'),
      { issuer: 'urn:oinkso:issuer', audience: 'urn:oinkso:audience' }
    );
    if (!payload) return;
    myusername = payload.sub;
  } catch (err) {
    myusername = undefined;
  }
  const username = req.query.username as string;

  const status = await redis.get(`status:${username}`);
  const likes = await redis.scard(`likes:${username}`);
  const liked = myusername
    ? (await redis.sismember(`likes:${username}`, myusername)) === 1
    : false;

  res.status(200).json({
    error: false,
    status: status,
    likes: likes,
    liked: liked,
    ad: false,
  });
}
