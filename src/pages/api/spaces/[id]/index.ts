import { NextApiRequest, NextApiResponse } from 'next';

export default function getspace(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  res.status(200).json({ id: id });
}
