# Sistema Anti-Calote

Gestão de cobranças automáticas via **Asaas** (PIX e assinaturas no cartão) e **WhatsApp** (Evolution API).

## Para a turma — instalação passo a passo

**Leia o guia completo:** [docs/INSTALACAO.md](docs/INSTALACAO.md)  
**Conta da turma (Asaas/Ngrok):** [docs/CONTA-COMPARTILHADA.md](docs/CONTA-COMPARTILHADA.md) — e-mail `faculdadeprojeto510@gmail.com`

Resumo rápido:

```bash
# 1. Infra
docker compose up -d

# 2. Ambiente
cp .env.example .env          # editar chaves Asaas + Ngrok
cd frontend && echo NEXT_PUBLIC_API_URL=http://localhost:3333/api > .env.local

# 3. Backend
cd backend && npm install && npm run migrate && npm run seed && npm run dev

# 4. Frontend (outro terminal)
cd frontend && npm install && npm run dev
```

| O quê | URL |
|-------|-----|
| Dashboard | http://localhost:3001 |
| Checkout academia | http://localhost:3001/assinar |
| API | http://localhost:3333/api |
| Evolution API | http://localhost:8080 |

## Funcionalidades

- **Clientes e cobranças PIX** — régua D-1, D-0, D+1… com link de fatura (sem PIX no texto)
- **Lembrete manual** — botão na tela de Cobranças (avulsas e assinaturas da academia)
- **Checkout `/assinar`** — planos mensal R$ 180 / anual R$ 1.800 (cartão, Asaas sandbox)
- **Webhooks** — confirma pagamento e ativa alunos no dashboard

## Configuração mínima

| Variável | Exemplo |
|----------|---------|
| `EVOLUTION_INSTANCE_NAME` | `projeto-teste` |
| `AUTHENTICATION_API_KEY` | `anti_calote_evo_secret_123` (igual ao Docker) |
| `ASAAS_API_KEY` | chave sandbox (conta compartilhada da turma) |
| `NGROK_AUTHTOKEN` | token ngrok (mesma conta; 1 túnel ativo por vez) |

## Scripts

```bash
cd backend
npm run dev          # API
npm run tunnel       # ngrok para webhooks Asaas
npm run regua:once   # testar régua de cobrança
npm run kill-port    # liberar porta 3333
```

## Documentação

- [docs/INSTALACAO.md](docs/INSTALACAO.md) — guia para colegas instalarem e testarem
- [docs/project-plan..md](docs/project-plan..md) — visão técnica do projeto
- [docs/docker-evo.yml](docs/docker-evo.yml) — referência do compose Evolution

## Estrutura

- `backend/` — Express + Knex + Clean Architecture
- `frontend/` — Next.js 16 + Tailwind
- `docker/` — init Postgres (`anti_calote_db`)
