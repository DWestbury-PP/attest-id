import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiHandler } from 'next';

const cookieName = 'attestid_session';

export function ironSession(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, {
    cookieName,
    password: process.env.SESSION_PASSWORD || 'development_password_change_me',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    }
  });
}
