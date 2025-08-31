'use client';
import React, { useState } from 'react';
import { SiweMessage } from 'siwe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Loader2 } from 'lucide-react';

export default function SiwePage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function connectAndSign() {
    setLoading(true);
    setStatus('');
    
    try {
      if (!('ethereum' in window)) {
        setStatus('No wallet detected. Please install MetaMask or another Web3 wallet.');
        return;
      }
      
      setStatus('Requesting wallet connection...');
      const [address] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      
      setStatus('Getting nonce...');
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
      
      setStatus('Please sign the message in your wallet...');
      const signature = await (window as any).ethereum.request({ 
        method: 'personal_sign', 
        params: [message.prepareMessage(), address] 
      });
      
      setStatus('Verifying signature...');
      const res = await fetch('/api/verify', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ message, signature }) 
      });
      const result = await res.json();
      
      if (result.ok) {
        setStatus('Successfully authenticated! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setStatus(`Authentication failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setStatus('User rejected the request');
      } else {
        setStatus(`Error: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Sign-In with Ethereum
          </CardTitle>
          <CardDescription>
            Connect your wallet and sign a message to authenticate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={connectAndSign} 
            disabled={loading} 
            className="w-full flex items-center gap-2"
            size="lg"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {loading ? 'Processing...' : 'Connect Wallet'}
          </Button>
          
          {status && (
            <div className="p-3 bg-muted rounded-md border">
              <p className="text-sm font-mono break-all">{status}</p>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, and more</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
