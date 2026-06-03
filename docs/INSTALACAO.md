# Guia de instalação — Sistema Anti-Calote

Documentação para rodar o projeto no computador de cada integrante da turma (Windows, macOS ou Linux).

## O que é o projeto

Sistema de cobrança com:

- **Dashboard admin** — clientes, cobranças PIX avulsas, régua automática no WhatsApp
- **Checkout Anti Calote** — matrícula em `/assinar` (planos mensal/anual no cartão)
- **Integrações** — Asaas (pagamentos) + Evolution API (WhatsApp)

## Pré-requisitos

| Ferramenta | Versão mínima | Para quê |
|------------|---------------|----------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | recente | Postgres, Redis, RabbitMQ, Evolution API |
| [Node.js](https://nodejs.org/) | 20 LTS | Backend e frontend |
| [Git](https://git-scm.com/) | qualquer | Clonar o repositório |
| Conta [Asaas Sandbox](https://sandbox.asaas.com/) | gratuita | Cobranças e assinaturas de teste |
| Conta [Ngrok](https://ngrok.com/) | gratuita | Receber webhooks do Asaas na máquina local |

Não é necessário instalar o CLI do ngrok — o projeto usa o pacote `@ngrok/ngrok` no backend.

### Conta compartilhada da turma

A turma usa o e-mail **`faculdadeprojeto510@gmail.com`** para Asaas e Ngrok (mesma API Key e mesmo Authtoken no `.env` de todos).

Detalhes: **[CONTA-COMPARTILHADA.md](CONTA-COMPARTILHADA.md)**  
Credenciais locais (senha + chaves): `docs/CONTA-TURMA.local.md` (arquivo ignorado pelo Git — peça ao responsável do grupo).

---

## 1. Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd projeto
```

Substitua `<URL_DO_REPOSITORIO>` pela URL que o time da faculdade usar (GitHub, GitLab, etc.).

---

## 2. Subir a infraestrutura (Docker)

Na **raiz** do projeto:

```bash
docker compose up -d
```

Aguarde todos os containers ficarem saudáveis (`docker compose ps`).

| Serviço | URL / porta | Uso |
|---------|-------------|-----|
| PostgreSQL | `localhost:5432` | Banco `anti_calote_db` (app) + `evolution_db` (Evolution) |
| Evolution API | http://localhost:8080 | WhatsApp |
| RabbitMQ (painel) | http://localhost:15672 | Login: `admin` / `admin_senha_local` |

O banco `anti_calote_db` é criado automaticamente pelo script em `docker/postgres/init/`.

---

## 3. Variáveis de ambiente

### Raiz do projeto (`.env`)

```bash
cp .env.example .env
```

Edite o `.env` na raiz:

```env
PORT=3333
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres_senha_local@localhost:5432/anti_calote_db
DEFAULT_USER_ID=00000000-0000-4000-8000-000000000001

# Conta turma: login sandbox.asaas.com → Integrações → API (mesma chave para todos)
ASAAS_API_KEY=sua_chave_sandbox_aqui
ASAAS_API_URL=https://sandbox.asaas.com/api/v3

# Mesmo token para toda a turma (igual no painel webhook do Asaas)
ASAAS_WEBHOOK_TOKEN=anti_calote_webhook_turma_2025

# Só em dev, se o Asaas não enviar token corretamente
ASAAS_WEBHOOK_SKIP_VERIFY=false

EVOLUTION_API_URL=http://localhost:8080
AUTHENTICATION_API_KEY=anti_calote_evo_secret_123
EVOLUTION_INSTANCE_NAME=projeto-teste

REGUA_ENABLED=true
REGUA_CRON=0 9 * * *

# Conta turma: login ngrok.com → Authtoken (mesmo para todos; só 1 túnel ativo por vez)
NGROK_AUTHTOKEN=seu_token_ngrok

PLAN_MONTHLY_VALUE=180
PLAN_ANNUAL_VALUE=1800

NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

> **Importante:** não commite o `.env` com chaves reais. Cada colega usa suas próprias chaves Asaas e Ngrok.

### Frontend (`frontend/.env.local`)

```bash
cd frontend
echo NEXT_PUBLIC_API_URL=http://localhost:3333/api > .env.local
```

O Next.js lê o `.env.local` dentro da pasta `frontend`, não o da raiz.

---

## 4. Backend

```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

Saída esperada:

```text
Backend rodando em http://localhost:3333
API: http://localhost:3333/api
[Regua] Cron agendado ...
```

Teste rápido:

```bash
curl http://localhost:3333/health
```

**Porta 3333 ocupada?**

```bash
npm run kill-port
npm run dev
# ou
npm run dev:clean
```

---

## 5. Frontend

Em **outro terminal**:

```bash
cd frontend
npm install
npm run dev
```

Abra: **http://localhost:3001**

| Página | URL |
|--------|-----|
| Dashboard | http://localhost:3001 |
| Cobranças | http://localhost:3001/cobrancas |
| Clientes | http://localhost:3001/clientes |
| Checkout Anti Calote | http://localhost:3001/assinar |

---

## 6. Evolution API (WhatsApp)

A API key global do Docker é a mesma do `.env`: `anti_calote_evo_secret_123` (header `apikey` nas requisições).

### Criar e conectar a instância

1. Com o Docker rodando, acesse o manager da Evolution ou use a API.
2. Crie uma instância chamada **`projeto-teste`** (igual a `EVOLUTION_INSTANCE_NAME` no `.env`).
3. Gere o **QR Code** e escaneie com o WhatsApp de teste (número secundário recomendado).
4. Confirme status **open/connected** antes de enviar mensagens.

### Testar envio

Com o backend rodando:

```bash
curl -X POST http://localhost:3333/api/dev/test-whatsapp ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"5511999999999\",\"text\":\"Teste Anti-Calote\"}"
```

No PowerShell (Windows), use aspas simples no JSON ou o Invoke-WebRequest equivalente.

**Formato do número:** apenas dígitos, com `55` no início (ex.: `5516999887766`). O sistema formata automaticamente a partir de `(16) 99988-7766`.

---

## 7. Webhooks do Asaas (pagamentos confirmados)

O Asaas precisa de uma URL pública. Use o túnel ngrok integrado ao projeto.

**Terminal A** — backend:

```bash
cd backend
npm run dev
```

**Terminal B** — túnel:

```bash
cd backend
npm run tunnel
```

Copie a URL HTTPS exibida (ex.: `https://xxxx.ngrok-free.dev`).

No [painel Asaas Sandbox](https://sandbox.asaas.com/) → **Integrações** → **Webhooks**:

| Campo | Valor |
|-------|--------|
| URL | `https://SUA-URL-NGROK/api/webhooks/asaas` |
| Token | mesmo valor de `ASAAS_WEBHOOK_TOKEN` no `.env` |
| Eventos | `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE` (recomendado) |

Reinicie o backend após alterar o `.env`.

**Problemas comuns**

- `endpoint already online` — já existe túnel ativo; use a URL mostrada ou `npm run tunnel:stop`
- Webhook não atualiza aluno — confira token e se o backend está na porta 3333

---

## 8. Fluxos para testar em grupo

### A) Cobrança avulsa (Anti-Calote)

1. Dashboard → **Clientes** → cadastrar cliente com WhatsApp válido
2. **Cobranças** → **Nova cobrança** (gera PIX no Asaas)
3. Em **Cobranças avulsas** → **Enviar lembrete** (manda link da fatura, sem PIX copia e cola no texto)
4. Pague no sandbox ou simule webhook → status **Pago**

### B) Matrícula Anti Calote (`/assinar`)

1. Abra http://localhost:3001/assinar
2. Preencha o formulário com **cartão de teste** do Asaas
3. Após sucesso → `/obrigado`
4. Dashboard → seção **Alunos matriculados**
5. **Cobranças** → assinaturas → **Enviar lembrete** (se pendente/vencido)

**Cartão sandbox (doc atual do Asaas):**

- Número: `4444 4444 4444 4444`
- Validade: qualquer mês/ano futuro (ex.: `12/30`)
- CVV: `123`

> Se a captura direta falhar no sandbox, o sistema tenta cobrar via API (`payWithCreditCard`) e, em último caso, abre a **fatura do Asaas** — onde o pagamento aparece como **Confirmada** (cartão), não como recebido em dinheiro.

**Erros no checkout:** leia a mensagem na tela (ex.: email já cadastrado, cartão recusado). Não use o mesmo email/CPF de um colega se ele já assinou.

### C) Régua automática

- Roda todo dia às **09:00** (`REGUA_CRON`)
- Teste manual: `cd backend && npm run regua:once`
- Envia lembretes com **link da fatura** via Evolution

---

## 9. Scripts úteis

| Comando | Onde | Descrição |
|---------|------|-----------|
| `npm run dev` | `backend` | API + cron da régua |
| `npm run dev` | `frontend` | Interface (porta 3001) |
| `npm run migrate` | `backend` | Aplicar migrations |
| `npm run seed` | `backend` | Usuário demo |
| `npm run regua:once` | `backend` | Rodar régua uma vez |
| `npm run tunnel` | `backend` | Túnel ngrok → porta 3333 |
| `npm run kill-port` | `backend` | Liberar porta 3333 |
| `npm run start:ngrok` | `backend` | Backend + túnel juntos |
| `docker compose up -d` | raiz | Subir infra |
| `docker compose down` | raiz | Parar infra |

---

## 10. Checklist por pessoa

- [ ] Docker rodando (`docker compose ps`)
- [ ] `.env` na raiz preenchido (Asaas + Ngrok)
- [ ] `frontend/.env.local` com `NEXT_PUBLIC_API_URL`
- [ ] `npm run migrate` e `npm run seed` OK
- [ ] Backend em http://localhost:3333/health
- [ ] Frontend em http://localhost:3001
- [ ] Instância Evolution `projeto-teste` conectada
- [ ] Webhook Asaas apontando para URL ngrok
- [ ] Teste: criar cliente + lembrete OU assinar em `/assinar`

---

## 11. Solução de problemas

| Sintoma | Possível causa | O que fazer |
|---------|----------------|-------------|
| Erro ao conectar no checkout | Backend parado ou `.env.local` ausente | Subir backend; criar `frontend/.env.local` |
| Email já cadastrado | Mesmo email no banco | Outro email ou limpar tabela `students` |
| Lembrete não envia | Evolution desconectada | Reescanear QR na instância `projeto-teste` |
| Evolution 400 Bad Request | Instância errada ou número inválido | Conferir `EVOLUTION_INSTANCE_NAME` e WhatsApp com 55 |
| Aluno não fica Ativo | Webhook não chegou | Ngrok + token Asaas + logs do backend |
| Porta em uso | Processo antigo | `npm run kill-port` no backend |
| Caracteres estranhos na UI | Encoding | Salvar arquivos em UTF-8 |

Logs do backend mostram requisições (`GET /api/...`, `POST /api/...`) e erros da Evolution.

---

## 12. Estrutura do repositório

```text
projeto/
├── backend/          # API Express (porta 3333)
├── frontend/         # Next.js (porta 3001)
├── docker/           # Init do Postgres
├── docs/             # Documentação
├── docker-compose.yml
├── .env.example
└── README.md
```

Referência técnica do plano: `docs/project-plan..md`

---

## Dúvidas entre a turma

1. Confiram se todos usam as **mesmas portas** (3333, 3001, 8080, 5432).
2. **Mesma** `ASAAS_API_KEY`, `NGROK_AUTHTOKEN` e `ASAAS_WEBHOOK_TOKEN` (conta `faculdadeprojeto510@gmail.com`).
3. **Ngrok:** apenas um colega com `npm run tunnel` ligado por vez (plano gratuito).
4. A instância WhatsApp Evolution é **por máquina** (`projeto-teste` + QR local).
5. No `/assinar`, use e-mails de teste **diferentes** por aluno fictício (`aluno2@teste.com`, etc.).

Bom teste.
