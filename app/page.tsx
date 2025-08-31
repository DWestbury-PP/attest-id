'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, FileText, Search, CheckCircle, AlertCircle } from 'lucide-react';

export default function Home() {
  const [me, setMe] = useState<{ authenticated: boolean; address?: string } | null>(null);
  const [attestations, setAttestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/me').then((r) => r.json()).then(setMe).catch(() => setMe({ authenticated: false }));
  }, []);

  const handleAttest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const form = e.target as HTMLFormElement;
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
    const note = (form.elements.namedItem('note') as HTMLInputElement).value;
    
    try {
      const res = await fetch('/api/attest', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ subject, note }) 
      });
      const json = await res.json();
      
      if (res.ok) {
        setMessage(`Attestation created: ${json.uid}`);
        form.reset();
      } else {
        setMessage(`Error: ${json.error || 'Failed to create attestation'}`);
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  const loadAttestations = async () => {
    if (!me?.address) return;
    setLoading(true);
    
    try {
      const res = await fetch(`/api/attestations?address=${me.address}`);
      const json = await res.json();
      setAttestations(json.items || []);
    } catch (err) {
      console.error('Failed to load attestations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <Button onClick={() => window.location.assign('/siwe')} className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Connect + SIWE
        </Button>
        
        {me?.authenticated && (
          <Button 
            variant="outline" 
            onClick={() => fetch('/api/logout', { method: 'POST' }).then(() => location.reload())}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}
        
        <Badge variant={me?.authenticated ? 'success' : 'destructive'} className="flex items-center gap-2">
          {me?.authenticated ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Connected: {me.address?.slice(0, 6)}...{me.address?.slice(-4)}
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3" />
              Not connected
            </>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Issue Attestation
            </CardTitle>
            <CardDescription>
              Create a new on-chain attestation for an Ethereum address
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!me?.authenticated ? (
              <p className="text-muted-foreground">Please connect your wallet first</p>
            ) : (
              <form className="space-y-4" onSubmit={handleAttest}>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject Address
                  </label>
                  <Input 
                    id="subject"
                    name="subject" 
                    placeholder="0x0000000000000000000000000000000000000000" 
                    required
                    pattern="0x[a-fA-F0-9]{40}"
                    title="Please enter a valid Ethereum address"
                    className="font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="note" className="text-sm font-medium">
                    Attestation Note
                  </label>
                  <Input 
                    id="note"
                    name="note" 
                    placeholder="Verified identity" 
                    required
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Create Attestation'}
                </Button>
                
                {message && (
                  <div className="mt-4 p-3 bg-muted rounded-md border">
                    <p className="text-sm font-mono break-all">{message}</p>
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              My Attestations
            </CardTitle>
            <CardDescription>
              View attestations associated with your connected wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!me?.authenticated ? (
              <p className="text-muted-foreground">Please connect your wallet first</p>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={loadAttestations} 
                  disabled={loading}
                  className="w-full mb-4"
                >
                  {loading ? 'Loading...' : 'Load Attestations'}
                </Button>
                
                <div className="space-y-3">
                  {attestations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No attestations found</p>
                  ) : (
                    attestations.map((att, i) => (
                      <div key={i} className="p-3 bg-muted rounded-md border">
                        <div className="space-y-1 text-sm">
                          <div><strong>UID:</strong> <span className="font-mono">{att.uid}</span></div>
                          <div><strong>Subject:</strong> <span className="font-mono">{att.subject}</span></div>
                          <div><strong>Note:</strong> {att.note}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
