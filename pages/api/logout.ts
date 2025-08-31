import type { NextApiRequest, NextApiResponse } from 'next';
import { ironSession } from '../../server/session';

export default ironSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  (req.session as any).destroy();
  res.json({ ok: true });
});
