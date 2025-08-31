import type { NextApiRequest, NextApiResponse } from 'next';
import { ironSession } from '../../server/session';

export default ironSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.session.address;
  res.json({ authenticated: !!address, address });
});
