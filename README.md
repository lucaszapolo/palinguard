# Palin Guard
Novo modelo de senhas, para Palin.

## Estrutura
- `backend/`: API Node.js + Express
- `frontend/`: React + Vite
- `backend/sql/schema.sql`: schema do banco

## Backend
1) Crie o banco Postgres
2) Execute `backend/sql/schema.sql`
3) Copie `backend/.env.example` para `.env` e ajuste
4) Rode:
```
cd backend
npm install
npm run dev
```

## Frontend
```
cd frontend
npm install
npm run dev
```

Opcional: copie `frontend/.env.example` para `.env` se quiser trocar a URL da API.

## Observacoes
- Importacao/exportacao estao com endpoint base no backend e UI placeholder no frontend.
- As permissoes seguem RBAC: admin, support, read.
- Para demo sem banco, use `MOCK_MODE=true` no backend.
- Login demo (mock): usuario `admin`, senha `admin123`.
