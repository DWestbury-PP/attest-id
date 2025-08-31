# attest id

EAS + SIWE Enterprise On-Ramp Kit.

## From brainstorming

- **What**: Batteries-included package that gives Web2 teams Sign-In with Ethereum (EIP-4361), attestations (EAS) for KYC/roles/badges, plus policy enforcement.
- **Why it pays**: SaaS, agencies, and token-gated communities want it done right with security best practices.

## References
- EIP-4361 (SIWE): https://eips.ethereum.org/EIPS/eip-4361
- EAS introduction: https://www.quicknode.com/guides/ethereum-development/smart-contracts/what-is-ethereum-attestation-service-and-how-to-use-it
- Optimism EAS docs: https://community.optimism.io/identity/contracts-eas

## Quickstart (Docker)

```bash
cd attest-id
cp -n .env.example .env || true
# edit SESSION_PASSWORD and optionally chain/RPC/EAS addresses
docker compose up --build
# open http://localhost:3000
```

## What's included
- **Next.js (App Router) + TypeScript** with modern ESM setup
- **shadcn/ui + Tailwind CSS** for professional UI components
- **Lucide React icons** replacing emojis for better UX
- **SIWE API routes**: `/api/nonce`, `/api/verify`, `/api/me`, `/api/logout`
- **Placeholder EAS routes**: `/api/attest`, `/api/attestations`
- **Auto wallet detection**: Works with MetaMask, Coinbase Wallet, WalletConnect, etc.
- **Responsive UI**: Clean cards, proper form validation, loading states
- **Docker setup**: Dockerfile and docker-compose for one-command deployment

## Next steps
- Wire EAS SDK with env-driven chain and `SCHEMA_ID`
- Add styled UI and explorer links
- Add tests and CI
