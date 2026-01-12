# Palin Guard Backend

## Setup
- Create a PostgreSQL database.
- Run the schema in `sql/schema.sql`.
- Create a `.env` file based on the variables below.

## Env vars
- `DATABASE_URL` (required)
- `JWT_ACCESS_SECRET` (required)
- `JWT_REFRESH_SECRET` (required)
- `JWT_ACCESS_TTL` (default `15m`)
- `JWT_REFRESH_TTL` (default `30d`)
- `CRYPTO_KEY` (base64 32 bytes, required)
- `PORT` (default `4000`)
- `MOCK_MODE` (optional, `true` para rodar sem banco)

## Mock mode
- Define `MOCK_MODE=true` para usar dados em memoria.
- Usuario admin: `admin`
- Senha admin: `admin123`

## Run
```
npm install
npm run dev
```
