# Hospital Appointment API

Node.js + TypeScript + Prisma + PostgreSQL CRUD module for a hospital appointment system.

## Features

- Patient CRUD operations
- Doctor CRUD operations
- Appointment management
- Prisma relations
- PostgreSQL database
- Database seed script
- TypeScript test script

## Run the project

Install dependencies:

```bash
npm install
```

Set the PostgreSQL connection string in a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/hospital"
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run the test script:

```bash
npm test
```