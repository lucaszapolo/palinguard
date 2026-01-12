# Palin Guard - Arquitetura e Wireframes (Consolidado)

## Visao geral
- Produto: Palin Guard
- Slogan: Guarde suas senhas com seguranca
- Ambiente: servidor interno
- Plataforma: desktop e mobile (responsivo, mobile-first)

## Stack aprovada
- Frontend: React + Vite
- Backend: Node.js + Express (API REST)
- Banco: PostgreSQL local
- Segurança: senhas criptografadas no backend + auditoria

## Requisitos mobile
- Consulta rapida: busca global sempre visivel
- Lista em cards no mobile
- Detalhe em painel com senha oculta e revelar temporario
- Copiar senha com feedback
- Filtros em drawer lateral
- Importacao e exportacao apenas no desktop

## Identidade visual
- Cores: branco, preto e dourado
- Dourado como acento (botao primario, icones principais, status)
- Top bar: preto/grafite com logo dourado
- Light e dark mode com preferencia salva por usuario

## Regras de acesso (RBAC)
- Admin: acesso total; unico que pode excluir, importar e exportar
- Suporte: listar, visualizar, copiar, criar e editar; sem excluir/importar/exportar
- Leitura: apenas listar/visualizar/copiar

## Arquitetura de frontend (conceitual)
- UI: componentes reutilizaveis (botoes, inputs, cards, tabela, modais)
- Pages: Login, Criar Conta, Dashboard, Senhas, Detalhe, Importar, Exportar
- Services: chamadas a API
- State: auth, tema, filtros, layout (mobile/desktop)
- Theme: tokens light/dark (branco/preto/dourado)
- Responsividade: cards no mobile, tabela no desktop; sidebar vira drawer

## Arquitetura de backend (conceitual)
- Controllers: orquestram requisicoes e respostas
- Services: regras de negocio (permissoes, auditoria, criptografia)
- Repositories: acesso ao banco
- Middlewares: autenticacao, autorizacao, validacao, rate limit
- Autenticacao: token com expiracao e refresh
- Auditoria: log de visualizar, copiar, criar, editar, excluir, importar e exportar

## Modelo de dados (conceitual)
- Users: id, nome, email, usuario, senha_hash, status, role, criado_em
- Groups: id, nome, descricao, criado_em
- UserGroups: user_id, group_id
- Secrets: id, titulo, tipo, usuario, email, senha_cript, site, grupo_id, observacao, data_inclusao, data_expiracao, criado_por
- AuditLogs: id, user_id, acao, secret_id, timestamp, meta
- Imports: id, user_id, arquivo, status, total, sucesso, erros, criado_em
- ImportErrors: import_id, linha, motivo

## Regras de negocio criticas
- Cadastro cria usuario com status pendente
- Admin aprova e define role e grupos
- Duplicidade de email e senha permitida
- Revele senha por tempo limitado e registre auditoria
- Importacao gera senha forte quando vazia
- Dominio preferencial de email apenas como aviso

## Wireframes textuais (front)

### Login
- Card central dividido (desktop); card simples (mobile)
- Campos: usuario/email, senha
- Links: criar conta, esqueci minha senha

### Criar conta
- Campos: nome, email, usuario, senha, confirmar senha
- Aviso: aguarde aprovacao do administrador
- Botao: solicitar acesso
- Link: ja tenho conta

### Dashboard
- Top bar com logo, nome do produto, toggle light/dark, usuario
- Cards: total senhas, expirando, recentes, mais acessadas
- Grafico por grupo
- Lista de atividades recentes
- Acoes rapidas: nova senha, importar, exportar

### Lista de senhas
- Linha de acoes: nova senha, importar, exportar, filtro
- Filtros colapsaveis (grupo, usuario/email, tipo, data, expiracao)
- Tabela no desktop; cards no mobile
- Acoes por linha: ver, copiar, editar, excluir (excluir apenas admin)

### Detalhe de senha
- Senha oculta por padrao
- Botao revelar por tempo limitado
- Botao copiar

### Cadastro/editar senha
- Secao credenciais: tipo, titulo, usuario, email, senha, site
- Secao classificacao: grupo, visualizacao, expiracao
- Secao observacoes
- Botoes: salvar, cancelar

### Importacao (desktop)
1) Upload (CSV/XLSX)
2) Mapeamento de colunas
3) Validacao (erros/avisos)
4) Pre-visualizacao + gerar senha quando vazia
5) Confirmacao + relatorio final

### Exportacao (desktop)
1) Selecionar filtros e colunas
2) Formato CSV/XLSX + gerar arquivo
