'use client';
import React, { useState } from 'react';
import { SiweMessage } from 'siwe';

export default function SiwePage() {
  const [status, setStatus] = useState('');

  async function connectAndSign() {
    if (!('ethereum' in window)) {
      setStatus('No injected wallet found.');
      return;
    }
    // Request accounts
    const [address] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
    const { nonce } = await fetch('/api/nonce', { method: 'POST' }).then((r) => r.json());

    const domain = window.location.host;
    const origin = window.location.origin;
    const statement = 'Sign in with Ethereum to attest.';
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: parseInt(chainId, 16),
      nonce
    });
    const signature = await (window as any).ethereum.request({ method: 'personal_sign', params: [message.prepareMessage(), address] });
    const ok = await fetch('/api/verify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message, signature }) }).then((r) => r.json());
    setStatus(JSON.stringify(ok));
  }

  return (
    <div>
      <h2>Sign-In with Ethereum</h2>
      <button onClick={connectAndSign}>Connect & Sign</button>
      <pre>{status}</pre>
    </div>
  );
}
