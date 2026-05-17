# Conta compartilhada da turma

A turma usa **uma conta Google** para serviços externos (Asaas Sandbox, Ngrok, etc.).

| Campo | Valor |
|-------|--------|
| **E-mail** | `faculdadeprojeto510@gmail.com` |
| **Senha** | Distribuída pelo responsável do grupo (WhatsApp/sala). **Não commitar no Git.** |

Arquivo local (opcional, já no `.gitignore`): copie `CONTA-TURMA.local.md.example` para `CONTA-TURMA.local.md` e preencha.

---

## Onde usar essa conta

### 1. Asaas Sandbox

1. Acesse https://sandbox.asaas.com/
2. Login com o e-mail da turma
3. **Minha conta** → **Integração** → copie a **API Key** (`$aact_...`)
4. No `.env` de cada máquina:

```env
ASAAS_API_KEY=<mesma_chave_para_todos>
ASAAS_API_URL=https://sandbox.asaas.com/api/v3
ASAAS_WEBHOOK_TOKEN=anti_calote_webhook_turma_2025
```

Todos usam a **mesma** `ASAAS_API_KEY` e o **mesmo** `ASAAS_WEBHOOK_TOKEN` (combinado com o painel Asaas).

### 2. Ngrok

1. Login em https://ngrok.com/ com o mesmo e-mail
2. Copie o **Authtoken** em https://dashboard.ngrok.com/get-started/your-authtoken
3. No `.env`:

```env
NGROK_AUTHTOKEN=<mesmo_token_para_todos>
```

**Atenção (plano gratuito):** só **um** colega deve rodar `npm run tunnel` por vez. Quem estiver testando webhook liga o túnel; os outros usam a URL que ele passar no grupo ou configuram webhook só na máquina dele.

### 3. Evolution API (WhatsApp)

A Evolution roda **local no Docker** de cada PC. A API key do container é fixa: `anti_calote_evo_secret_123`.

Cada integrante:

1. Cria/conecta a instância **`projeto-teste`** no próprio Docker
2. Escaneia o QR com um **número de WhatsApp de teste** (pode ser o mesmo número da turma em um aparelho, ou cada um com o seu)

Não é necessário login Google na Evolution para o fluxo básico.

---

## O que continua individual por máquina

| Item | Por pessoa? |
|------|-------------|
| Docker / Postgres local | Sim |
| `npm run dev` backend + frontend | Sim |
| QR Code WhatsApp (Evolution) | Sim (instância local) |
| URL ngrok ativa | Um por vez (conta compartilhada) |
| Banco `anti_calote_db` | Sim (dados locais) |

---

## Checkout `/assinar`

Para testar matrícula, use **e-mails fictícios diferentes** por teste (ex.: `aluno1@teste.com`), para não bater em “email já cadastrado”. O login da conta Google acima é só para **Asaas/Ngrok**, não para o formulário de aluno.

---

## Segurança

- Conta só para **sandbox / faculdade**
- Não publicar senha no GitHub
- Trocar senha do Gmail se o repositório for público e a senha tiver vazado
