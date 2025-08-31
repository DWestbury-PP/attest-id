import type { NextApiRequest, NextApiResponse } from 'next';
import { ironSession } from '../../server/session';
import { generateNonce } from 'siwe';

export default ironSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const nonce = generateNonce();
  req.session.nonce = nonce;
  await req.session.save();
  res.json({ nonce });
});
