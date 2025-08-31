import React from 'react';
import './globals.css';

export const metadata = {
  title: 'attest-id',
  description: 'Enterprise-grade Sign-In with Ethereum + Attestations'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div>
              <h1 className="logo">attest-id</h1>
              <p className="subtitle">Sign-In with Ethereum + Attestations (EAS)</p>
            </div>
          </header>
          <main className="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
