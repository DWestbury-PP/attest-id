import type { NextApiRequest, NextApiResponse } from 'next';
import { ironSession } from '../../server/session';

export default ironSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const address = (req.session as any).address as string | undefined;
  if (!address) return res.status(401).json({ error: 'not_authenticated' });
  const { subject, note } = (req.body ?? {}) as { subject?: string; note?: string };
  // Placeholder implementation: echo inputs and return a fake UID
  const uid = '0x' + Math.floor(Date.now() / 1000).toString(16).padStart(16, '0');
  res.json({ uid, subject, note, issuer: address, network: process.env.CHAIN_ID || 'unknown' });
});
