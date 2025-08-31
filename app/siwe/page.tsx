'use client';
import React, { useState } from 'react';
import { SiweMessage } from 'siwe';

export default function SiwePage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function connectAndSign() {
    setLoading(true);
    setStatus('');
    
    try {
      if (!('ethereum' in window)) {
        setStatus('❌ No wallet detected. Please install MetaMask or another Web3 wallet.');
        return;
      }
      
      setStatus('🔄 Requesting wallet connection...');
      const [address] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      
      setStatus('🔄 Getting nonce...');
      const { nonce } = await fetch('/api/nonce', { method: 'POST' }).then((r) => r.json());

      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = 'Sign this message to authenticate with attest-id';
      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: parseInt(chainId, 16),
        nonce
      });
      
      setStatus('🔄 Please sign the message in your wallet...');
      const signature = await (window as any).ethereum.request({ 
        method: 'personal_sign', 
        params: [message.prepareMessage(), address] 
      });
      
      setStatus('🔄 Verifying signature...');
      const res = await fetch('/api/verify', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ message, signature }) 
      });
      const result = await res.json();
      
      if (result.ok) {
        setStatus('✅ Successfully authenticated! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setStatus(`❌ Authentication failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setStatus('❌ User rejected the request');
      } else {
        setStatus(`❌ Error: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="siwePage">
      <div className="siweCard">
        <h2>Sign-In with Ethereum</h2>
        <p>Connect your wallet and sign a message to authenticate</p>
        
        <button className="button" onClick={connectAndSign} disabled={loading} style={{ width: '100%' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 7h14l-1 7H6L5 7Z"/>
            <path d="M5 7l-1-3h16l-1 3"/>
            <path d="M10 14v6"/>
            <path d="M14 14v6"/>
            <path d="M8 20h8"/>
          </svg>
          {loading ? 'Processing...' : 'Connect Wallet'}
        </button>
        
        {status && (
          <div className="statusBox">
            {status}
          </div>
        )}
        
        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
          <p>Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, and more</p>
        </div>
      </div>
    </div>
  );
}
