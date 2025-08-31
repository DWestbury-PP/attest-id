'use client';
import React, { useEffect, useState } from 'react';

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
        setMessage(`✅ Attestation created: ${json.uid}`);
        form.reset();
      } else {
        setMessage(`❌ Error: ${json.error || 'Failed to create attestation'}`);
      }
    } catch (err) {
      setMessage('❌ Network error');
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
      <div className="authSection">
        <button className="button" onClick={() => window.location.assign('/siwe')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          </svg>
          Connect + SIWE
        </button>
        
        {me?.authenticated && (
          <button className="button secondary" onClick={() => fetch('/api/logout', { method: 'POST' }).then(() => location.reload())}>
            Logout
          </button>
        )}
        
        <div className={`statusBadge ${me?.authenticated ? 'authenticated' : 'unauthenticated'}`}>
          <span className={`dot ${me?.authenticated ? 'green' : 'red'}`}></span>
          {me?.authenticated ? (
            <>Connected: {me.address?.slice(0, 6)}...{me.address?.slice(-4)}</>
          ) : (
            'Not connected'
          )}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>📝 Issue Attestation</h2>
          {!me?.authenticated ? (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Please connect your wallet first</p>
          ) : (
            <form className="form" onSubmit={handleAttest}>
              <div className="formGroup">
                <label className="label" htmlFor="subject">Subject Address</label>
                <input 
                  id="subject"
                  name="subject" 
                  className="input" 
                  placeholder="0x0000000000000000000000000000000000000000" 
                  required
                  pattern="0x[a-fA-F0-9]{40}"
                  title="Please enter a valid Ethereum address"
                />
              </div>
              
              <div className="formGroup">
                <label className="label" htmlFor="note">Attestation Note</label>
                <input 
                  id="note"
                  name="note" 
                  className="input" 
                  placeholder="Verified identity" 
                  required
                />
              </div>
              
              <button className="button" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Attestation'}
              </button>
              
              {message && (
                <div className="statusBox" style={{ marginTop: '1rem' }}>
                  {message}
                </div>
              )}
            </form>
          )}
        </div>

        <div className="card">
          <h2>🔍 My Attestations</h2>
          {!me?.authenticated ? (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Please connect your wallet first</p>
          ) : (
            <>
              <button className="button secondary" onClick={loadAttestations} disabled={loading}>
                {loading ? 'Loading...' : 'Load Attestations'}
              </button>
              
              <div className="attestationsList">
                {attestations.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>No attestations found</p>
                ) : (
                  attestations.map((att, i) => (
                    <div key={i} className="attestationItem">
                      <strong>UID:</strong> {att.uid}<br/>
                      <strong>Subject:</strong> {att.subject}<br/>
                      <strong>Note:</strong> {att.note}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
