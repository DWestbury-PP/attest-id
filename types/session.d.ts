import 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    nonce?: string;
    address?: string;
  }
}

declare module 'next' {
  interface NextApiRequest {
    session: import('iron-session').IronSession;
  }
}
