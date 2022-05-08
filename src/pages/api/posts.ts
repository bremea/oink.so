import { NextApiRequest, NextApiResponse } from 'next';

import redis from '@/lib/redis';

export default async function posts(req: NextApiRequest, res: NextApiResponse) {
  const posts = await redis.scan(0, { count: 50, match: 'status:*' });
  const sendPosts = [];
  for (const post of posts[1]) {
    sendPosts.push({
      username: post.replace('status:', ''),
      status: await redis.get(post),
      likes: await redis.llen(`likes:${post.replace('status:', '')}`),
    });
  }
  return res.status(200).json({ error: false, posts: sendPosts });
}
