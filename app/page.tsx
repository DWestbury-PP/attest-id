'use client';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [me, setMe] = useState<{ authenticated: boolean; address?: string } | null>(null);
  useEffect(() => {
    fetch('/api/me').then((r) => r.json()).then(setMe).catch(() => setMe({ authenticated: false }));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={() => window.location.assign('/siwe')}>Connect + SIWE</button>
        <button onClick={() => fetch('/api/logout', { method: 'POST' }).then(() => location.reload())}>Logout</button>
        <span style={{ color: me?.authenticated ? 'green' : 'red' }}>
          {me?.authenticated ? `Signed in as ${me.address}` : 'Not signed in'}
        </span>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Issue demo attestation</h3>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
          const note = (form.elements.namedItem('note') as HTMLInputElement).value;
          const res = await fetch('/api/attest', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ subject, note }) });
          const json = await res.json();
          alert(JSON.stringify(json));
        }}>
          <label>
            Subject (0x...):
            <input name="subject" placeholder="0x..." style={{ width: 400, marginLeft: 8 }} />
          </label>
          <br />
          <label>
            Note:
            <input name="note" placeholder="hello" style={{ width: 400, marginLeft: 8 }} />
          </label>
          <br />
          <button type="submit">Attest</button>
        </form>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>My attestations</h3>
        <button onClick={async () => {
          const addr = me?.address || '';
          const res = await fetch(`/api/attestations?address=${addr}`);
          const json = await res.json();
          alert(JSON.stringify(json));
        }}>Refresh</button>
      </div>
    </div>
  );
}
