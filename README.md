# MedInnovate

MedInnovate uses a React + Vite frontend and a Node/Express backend.

## Backend Deployment Variables

The Railway backend must be configured with Aiven MySQL credentials. No localhost defaults or hardcoded credentials are used.

Required:

```env
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
```

Optional:

```env
MYSQL_SSL=
PORT=
NODE_ENV=
```

For Aiven MySQL, set:

```env
MYSQL_SSL=true
```

Keep real secrets in Railway environment variables or a local `.env` file. Only `.env.example` should be committed.

## Frontend API Target

The frontend API base is configured in:

```txt
src/config/api.js
```

It points to the Railway backend:

```txt
https://medinnovate-production.up.railway.app
```
