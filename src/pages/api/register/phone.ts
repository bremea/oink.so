import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

import error from '@/lib/error';
import redis from '@/lib/redis';

export default async function phone(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return error('POST requests only', res);
  if (!req.body.phone) return error('Missing phone number', res);

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_ACCOUNT_AUTH
  );
  const code = Math.floor(100000 + Math.random() * 900000);

  await redis.set(`phone:${req.body.phone}`, code);
  await client.messages.create({
    messagingServiceSid: process.env.TWILIO_MSG_SID,
    to: req.body.phone,
    body: `Your oink.so verification is ${code}`,
  });

  res.status(200).json({ error: false });
}
