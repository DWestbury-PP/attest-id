import { getIronSession } from 'iron-session';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const cookieName = 'attestid_session';

export function ironSession(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession(req, res, {
      cookieName,
      password: process.env.SESSION_PASSWORD || 'development_password_change_me',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
      }
    });
    (req as any).session = session;
    return handler(req, res);
  };
}
