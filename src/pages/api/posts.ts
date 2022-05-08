import * as jose from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

import redis from '@/lib/redis';

export default async function posts(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization as string;
  let username: string | undefined = undefined;
  try {
    const { payload } = await jose.jwtVerify(
      token,
      await jose.importPKCS8(process.env.JWTKEY as string, 'RSA'),
      { issuer: 'urn:oinkso:issuer', audience: 'urn:oinkso:audience' }
    );
    if (!payload) return;
    username = payload.sub;
  } catch (err) {
    username = undefined;
  }

  const posts = await redis.scan(0, { count: 50, match: 'status:*' });
  const sendPosts = [];
  for (const post of posts[1]) {
    sendPosts.push({
      username: post.replace('status:', ''),
      status: await redis.get(post),
      likes: await redis.scard(`likes:${post.replace('status:', '')}`),
      liked: username
        ? await redis.sismember(
            `likes:${post.replace('status:', '')}`,
            username
          )
        : false,
    });
  }
  return res.status(200).json({ error: false, posts: sendPosts });
}
