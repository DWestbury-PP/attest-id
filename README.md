# attest-id

**Enterprise-grade Web3 authentication and attestation platform**

A production-ready starter kit combining Sign-In with Ethereum (SIWE) and Ethereum Attestation Service (EAS) for secure identity verification, role management, and compliance workflows.

## Problem Statement

Web2 enterprises adopting Web3 need secure, compliant identity solutions that integrate with existing systems. Current Web3 auth solutions lack enterprise features like attestation management, role-based access, and audit trails.

## Solution

`attest-id` provides a batteries-included platform that bridges Web2 enterprise needs with Web3 identity primitives:

- **🔐 SIWE Authentication** - Secure wallet-based login following EIP-4361
- **📋 Attestation Management** - Issue and verify on-chain credentials via EAS
- **🏢 Enterprise Ready** - Session management, audit trails, and policy enforcement
- **⚡ Developer Experience** - Docker deployment, TypeScript, modern UI components

## Quick Start

```bash
git clone <repo-url>
cd attest-id
cp .env.example .env
# Configure SESSION_PASSWORD and blockchain settings
docker compose up --build
# Open http://localhost:3000
```

## Architecture

- **Frontend**: Next.js 14 (App Router) + shadcn/ui + Tailwind CSS
- **Authentication**: SIWE (EIP-4361) with iron-session management
- **Attestations**: Ethereum Attestation Service (EAS) integration
- **Deployment**: Docker + Docker Compose for production readiness

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/nonce` | POST | Generate SIWE nonce |
| `/api/verify` | POST | Verify SIWE signature & create session |
| `/api/me` | GET | Get current authentication status |
| `/api/logout` | POST | Destroy session |
| `/api/attest` | POST | Issue new attestation |
| `/api/attestations` | GET | Query attestations by address |

## Use Cases

- **SaaS Platforms**: Token-gated access with role attestations
- **DAOs**: Member verification and governance participation
- **DeFi Protocols**: KYC/AML compliance with privacy preservation
- **Enterprise**: Employee credentialing and access management
- **NFT Communities**: Holder verification and exclusive access

## Configuration

Key environment variables:

```bash
SESSION_PASSWORD=<32-char-random-string>
CHAIN_ID=11155111                    # Sepolia testnet
RPC_URL=https://rpc.ankr.com/eth_sepolia
EAS_CONTRACT_ADDRESS=0xC2679fBD37d54388Ce493F1DB75320D236e1815e
SCHEMA_ID=<your-eas-schema-id>
```

## Roadmap

- [ ] **EAS SDK Integration** - Replace placeholder with real on-chain attestations
- [ ] **Multi-chain Support** - Ethereum, Polygon, Optimism, Arbitrum
- [ ] **Schema Management** - UI for creating and managing EAS schemas  
- [ ] **Webhook System** - Real-time attestation notifications
- [ ] **Analytics Dashboard** - Usage metrics and compliance reporting
- [ ] **SSO Integration** - SAML/OIDC bridge for enterprise identity providers

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Resources

- [EIP-4361 (SIWE) Specification](https://eips.ethereum.org/EIPS/eip-4361)
- [Ethereum Attestation Service](https://docs.attest.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
