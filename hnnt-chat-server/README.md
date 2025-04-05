## Necessary technologies

-   Node, npm, PostgreSQL, pgAdmin, redis

## Run script sql

-   step 1: Update node_modules by package-lock.json

```bash
npm install
```

-   step 2: Run script file .sql into src/prisma/migrations

-   step 3: Add sample data by command

```bash
npm run seed
```

3

## (If any) Map directly down to PostgreSQL

-   step 1: Config database in file .env follow .env.sample

-   step 2: Map by command:

```bash
npm run migrate
```

-   step 3: Add sample data by command

```bash
npm run seed
```
