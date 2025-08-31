import React from 'react';

export const metadata = {
  title: 'attest-id',
  description: 'SIWE + EAS demo kit'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
          <h1>attest-id</h1>
          <p style={{ color: '#666' }}>Sign-In with Ethereum + Attestations (EAS)</p>
          {children}
        </div>
      </body>
    </html>
  );
}
