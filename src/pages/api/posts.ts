import { NextApiRequest, NextApiResponse } from 'next';

export default async function getposts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200);
}
