import { NextApiRequest, NextApiResponse } from 'next';

import redis from '@/lib/redis';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const username = req.query.username as string;

  const status = await redis.get(`status:${username}`);
  const likes = await redis.llen(`likes:${username}`);

  res.status(200).json({ error: false, status: status, likes: likes });
}
