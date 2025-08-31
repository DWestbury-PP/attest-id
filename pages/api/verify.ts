import type { NextApiRequest, NextApiResponse } from 'next';
import { ironSession } from '../../server/session';
import { SiweMessage } from 'siwe';

export default ironSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { message, signature } = req.body as { message: any; signature: string };
    const siwe = new SiweMessage(message);
    const { data } = await siwe.verify({ signature, domain: req.headers.host!, nonce: (req.session as any).nonce });
    (req.session as any).address = data.address;
    await (req.session as any).save();
    res.json({ ok: true, address: data.address });
  } catch (err) {
    res.status(400).json({ ok: false, error: (err as Error).message });
  }
});
