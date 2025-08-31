import React from 'react';
import './globals.css';

export const metadata = {
  title: 'attest-id',
  description: 'Enterprise-grade Sign-In with Ethereum + Attestations'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="dark">
        <div className="container mx-auto max-w-7xl px-4 py-8 min-h-screen flex flex-col">
          <header className="flex justify-between items-center py-8 border-b border-border mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                attest-id
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Sign-In with Ethereum + Attestations (EAS)
              </p>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
