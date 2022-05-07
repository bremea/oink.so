import { NextApiRequest, NextApiResponse } from 'next';

export default function getspace(req: NextApiRequest, res: NextApiResponse) {
  const username = req.query.username as string;

  res.status(200).json({ username: username });
}
