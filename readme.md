### Autenticação / Autorização

* [ ] Implementar registro de usuário (email, senha, nome, telefone opcional).
* [ ] Implementar login com JWT (access token + refresh token).
* [ ] Implementar renovação de refresh token.
* [ ] Implementar recuperação de senha por email (token único, expiração configurável).
* [ ] Implementar verificação de email (token de confirmação).
* [ ] Implementar RBAC (roles configuráveis: owner, admin, manager, cashier, instructor, accountant).
* [ ] Endpoints para gestão de roles e permissões (CRUD).

### Multi-entidade / Organização

* [ ] Modelar `Organization` (o seu negócio - "parceiro") que agrupa empreendimentos.
* [ ] Modelar `Estabelecimento` (cada unidade física: casa de lojas, loja, academia).
* [ ] Permitir criar/editar/excluir estabelecimentos dentro de uma Organization.
* [ ] Associar usuários a uma Organization e a um ou mais Estabelecimentos com roles por-estabelecimento.

### Clientes / Membros

* [ ] CRUD de `Cliente` (nome, contacto, documento, notas).
* [ ] Registrar cliente associado a organização e/ou estabelecimento.
* [ ] Histórico de transações e presença por cliente.
* [ ] Perfil de membro (dados biométricos opcionais/documentos).

### Gestão de Produtos (loja)

* [ ] CRUD de `Produto` (nome, SKU, preço venda, custo, imposto, unidade, categorias).
* [ ] Controle de `Estoque` por estabelecimento (quantidade, mínimo, localização).
* [ ] Entradas de estoque (compras/recebimento) com fornecedor.
* [ ] Saídas de estoque (venda, transferência, ajuste negativo/positivo).
* [ ] Transferência de estoque entre estabelecimentos.
* [ ] Lote/serial/opcional por produto.
* [ ] Controle de preços promocionais (preço com validade).

### Ponto de Venda (POS) / Vendas

* [ ] Endpoint para criar `Venda` (itens, quantidades, descontos, impostos, forma de pagamento).
* [ ] Suportar pagamento parcial, estornos e trocas.
* [ ] Gerar fatura/recibo (dados fiscais configuráveis).
* [ ] Marcar vendas como presenciais (POS) ou online/reserva.
* [ ] Fluxo para fechamento de caixa diário por usuário/caixa.
* [ ] Relatórios de vendas por intervalo, estabelecimento, produto, vendedor.

### Serviços / Academia (Jiu Jitsu)

* [ ] CRUD de `Plano` / `MembroShip` (assinaturas: mensal, trimestral, anual).
* [ ] Agendamento de aulas / turmas (horário, instrutor, capacidade).
* [ ] Gestão de instrutores (perfil, horários).
* [ ] Check-in de membro para aula (presença).
* [ ] Controle de limite de vagas por aula / fila de espera.
* [ ] Registro de aulas avulsas (drop-in) e venda de pacotes de aulas.
* [ ] Emissão de recibos/assinaturas automáticas para renovações.

### Financeiro / Faturação

* [ ] Registro de `Recebimento` (pagamentos) ligado a venda/assinatura/fatura.
* [ ] Registro de `Despesa` (fornecedores, manutenção, alugueis).
* [ ] Emissão de `Fatura/Invoice` (vinculada a cliente/assinatura) com status (aberta, paga, vencida).
* [ ] Integração com gerador de PDF (fatura) e endpoint para download.
* [ ] Relatórios de fluxo de caixa, contas a receber/pagar.
* [ ] Lançamentos recorrentes (ex.: aluguel, assinatura de software).

### Contratos / Aluguéis (casa de lojas)

* [ ] CRUD de `Contrato` de arrendamento por loja (inquilino, loja, valor, período, vencimento).
* [ ] Registro de cobrança periódica automática (boleto/fatura) e alertas de vencimento.
* [ ] Gestão de depósitos/garantias e reajustes (índice configurável).
* [ ] Histórico de ocupação por loja.

### Fornecedores / Compras

* [ ] CRUD de `Fornecedor` (contacto, condições de pagamento).
* [ ] Pedido de compra (Purchase Order) com aprovação e recebimento (input estoque).
* [ ] Termos de pagamento, prazos e notas fiscais de entrada.

### Relatórios / Dashboards

* [ ] Endpoints para KPIs: receita diária/mensal, ocupação de lojas, taxa de retenção de membros, churn de assinaturas, vendidos por produto.
* [ ] Históricos e filtros por estabelecimento/data/usuario.
* [ ] Export CSV/JSON para relatórios.

### Notificações / Comunicações

* [ ] Envio de emails transacionais (confirmação, recibo, lembrete de pagamento, renovação).
* [ ] Envio de notificações in-app (fila de webhooks ou events).
* [ ] Integração opcional com SMS/WhatsApp via provider (configurável).

### Auditoria / Logs

* [ ] Registrar audit trail para operações críticas (criar/atualizar/excluir entidades financeiras, login, alteração de roles).
* [ ] Endpoint para consultar logs por entidade/usuário/data.

### API / Documentação

* [ ] Documentar API com OpenAPI (Swagger) gerado automaticamente.
* [ ] Versionamento de API (/v1/...).
* [ ] Endpoints health-check e readiness.

### Integrações externas

* [ ] Suporte a gateways de pagamento (configurável: Stripe-like / local).
* [ ] Webhooks para notificações de pagamento.
* [ ] Integração opcional com contabilização/exportação para software contábil.

### Admin / Configurações

* [ ] CRUD de configurações da Organization (moeda, fuso-horário, impostos, logo, dados fiscais).
* [ ] Seletor de idioma/localização.
* [ ] Backup / exportação de dados (por estabelecimento/organização).

---

## Regras de Negócio (ligadas a cada requisito) — o mais granular possível

> cada regra corresponde a um requisito acima. Especifique comportamentos concretos.

### Autenticação / Autorização

* [ ] Senhas armazenadas com hashing forte (bcrypt/argon2) + salt.
* [ ] Access token expira (curto prazo), refresh token expira (mais longo); revogação imediata ao logout.
* [ ] Usuário sem verificação de email não pode criar estabelecimentos nem emitir faturas.
* [ ] Roles definem permissões por recurso; permission-check obrigatório em todos endpoints sensíveis.

### Multi-entidade / Organização

* [ ] Um usuário pode pertencer a múltiplas Organizations; cada request deve conter `organization_id` (ou header) para escopo.
* [ ] Recursos são isolados por Organization (multi-tenant por schema ou por tenant_id em cada tabela).
* [ ] Somente Owners podem excluir Organization; exclusão marca `soft-delete`.

### Clientes / Membros

* [ ] Cliente com presença em atraso em mais de X dias bloqueia nova matrícula/assinatura (configurável).
* [ ] Identificadores únicos: documentos fiscais/ID não podem duplicar na mesma Organization.

### Gestão de Produtos / Estoque

* [ ] Não permitir criar venda com quantidade maior que estoque disponível (a menos que `allow_backorder=true`).
* [ ] Ajustes de estoque sempre devem ter justificativa e usuário autor (audit trail).
* [ ] Preços com validade: preço ativo é o que tem validade atual; histórico mantido.

### Vendas / POS

* [ ] Uma venda só é considerada `paga` quando recebimento confirmado (ou parcial com saldo pendente).
* [ ] Estorno cria operação inversa e altera estoque conforme regra do produto (recolocar no estoque se retornado).
* [ ] Fechamento de caixa impede alterações em vendas associadas ao caixa após fechamento sem autorização de admin.

### Academia / Aulas

* [ ] Aula só pode ser confirmada se instrutor e local estiverem disponíveis.
* [ ] Cancelamento de aula com menos de X horas antes gera regra de não-reembolso (configurável).
* [ ] Renovação automática de assinaturas: notificar 7 dias antes; cobrança automática se payment method ativo.

### Financeiro / Faturação

* [ ] Fatura vencida gera cobrança de multa/juros após Y dias (configurável por Organization).
* [ ] Pagamentos aplicados primeiro a cobranças mais antigas (FIFO) — configurável.
* [ ] Criação de fatura gera `invoice_number` sequencial por Organization com padding configurável.

### Contratos / Aluguéis

* [ ] Reajuste anual por índice configurável; aplicação automática na próxima cobrança.
* [ ] Se loja estiver vaga, não gerar cobrança de inquilino para esse shop_id.
* [ ] Quebras de contrato: calcular multa proporcional aos meses restantes conforme cláusula.

### Fornecedores / Compras

* [ ] Recebimento parcial é permitido; PO só é `closed` quando quantidade recebida = quantidade pedida.
* [ ] Condição de pagamento aplicada conforme PO no momento do recebimento.

### Segurança / Compliance

* [ ] Todas as transações sensíveis devem ser idempotentes (ex.: pagamento) usando idempotency-key.
* [ ] Dados sensíveis (documentos, tokens) armazenados criptografados em repouso.
* [ ] Logs de acesso preservados por pelo menos X dias (configurável).

---

## Requisitos Não-Funcionais

### Arquitetura / Persistência

* [ ] Banco de dados relacional (Postgres recomendado). Modelagem com chaves compostas onde necessário.
* [ ] Migrations versionadas (eg. Knex/TypeORM/Prisma).
* [ ] Cache para leituras frequentes (Redis).
* [ ] Armazenamento de arquivos (faturas/PDFs, imagens) em S3-compatible.

### Performance / Escalabilidade

* [ ] API deve responder 95% dos requests em <300ms sob carga nominal (meta).
* [ ] Suportar escalonamento horizontal (stateless API; sessões via JWT).
* [ ] Implementar paginação eficiente (cursor-based recomendado) em endpoints list.

### Segurança

* [ ] HTTPS obrigatório; HSTS habilitado.
* [ ] Validações de input / sanitização em todos endpoints (evitar injection).
* [ ] Rate limiting por IP e por API key.
* [ ] CSP, CORS configuráveis por Organization.


### Testes / Qualidade

* [ ] Cobertura unitária e testes de integração para rotas críticas (autenticação, pagamento, faturamento).
* [ ] Testes end-to-end em ambiente de staging.
* [ ] Lint e CI (GitHub Actions/CI) com pipeline: lint → testes → build → deploy automático em staging.

### Documentação / UX para Devs

* [ ] OpenAPI completo + exemplos de request/response.
* [ ] Postman/Insomnia collection.
* [ ] Guia de onboarding do dev (setup local com docker-compose).

### Manutenibilidade

* [ ] Código modular, controllers leves, serviços com lógica de negócio centralizada.
* [ ] Migrations e seeders para testes.
* [ ] Versionamento semântico.

---

## Operacionais / Infra / APIs externas / Observabilidade

* [ ] Definir provider de email (Sendgrid/Mailgun/ou local).
* [ ] Definir gateway de pagamentos (Stripe/Local) e flow de webhooks.
* [ ] Definir armazenamento (S3 compatible).
* [ ] Provisionar Redis para cache e fila (BullMQ).
* [ ] Fila de background para jobs (notificações, geração de PDF, cobranças recorrentes).
* [ ] CI/CD: pipeline para build do backend e deploy em staging/production.
* [ ] Monitoramento (Grafana/Prometheus) e logging centralizado (ELK / Loki).
* [ ] Política de retenção de dados e conformidade (GDPR-like se aplicável).

---

## Prioridade sugerida (primeiras tasks para começar)

* [ ] Esqueleto do projeto Fastify + configuração JWT + OpenAPI básico.
* [ ] Modelagem inicial: Organization, User, Establishment, Role.
* [ ] Autenticação (registo/login/refresh) + RBAC básico.
* [ ] CRUD de Estabelecimentos e configuração Organization (moeda, impostos).
* [ ] CRUD de Cliente e Produto mínimo + estoque mínimo.
* [ ] Endpoints de Venda (criar venda simples) e recebimento com PDF básico.
* [ ] Jobs: fila + worker para envio de email e geração de PDF.
* [ ] OpenAPI + Postman collection inicial.

---

## Observações finais (operacionais rápidas)

* [ ] Tudo deve ser configurável por Organization: impostos, moeda, políticas de renovação, regras de reajuste.
* [ ] Use idempotency-key em endpoints de pagamento e de criação de recursos financeiros.
* [ ] Projetar para permitir que o mesmo backend sirva múltiplas instâncias do app Electron conectando ao mesmo tenant/organization.
