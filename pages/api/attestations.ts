import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query as { address?: string };
  // Placeholder: return empty list; will wire to EAS later
  res.json({ address, items: [] });
}
