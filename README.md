# Venomous Notes

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
  - [Local Setup](#local-setup)
  - [Schema Changing & Migration](#schema-changing--migration)
- [Links](#links)

## Overview

...

## Tech Stack

|                           | Port | Main Skills                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server                    | 7000 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-frontend--nextjs.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-backend--trpc.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--prisma.png?raw=true" style="width:40px;" /> |
| DataBase                  | 7100 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--postgresql.png?raw=true" style="width:40px;" /><br/><img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--neon?raw=true" style="width:40px;" />                                                                                                                                                     |
| Prisma Studio<br/>( dev ) | 7200 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--prisma.png?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                            |
| MinIO                     | 7300 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-database--minio?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

- Next.js v15
- react-query v5
- zod v3
- tRPC v11
- Prisma v6
- PostgreSQL v13
- Neon
- MinIO

## Usage

### Local Setup

```zsh
# 1. clone then go to the directory
% git clone https://github.com/BlaxBerry333/venomous-notes.git
% cd venomous-notes

# 2. setup containers
% make setup-all ENV=dev    # dev environment
% make setup-all ENV=prod   # prod environment
% make setup-all            # prod environment
```

### Schema Changing & Migration

#### 1. change `/prisma/schema.prisma`

```prisma
model CustomModel { ... }

enum CustomEnum { ... }
```

#### 2. create migration according to latest schema

```zsh
% make entry CONTAINER=notes_server
/usr/src/app # npx prisma migrate dev --name [MIGRATION_NAME]
```

#### 3. update Prisma Client

```zsh
% make entry CONTAINER=notes_server
/usr/src/app # npx prisma generate
```

#### 4. restart Docker container of server and db

`notes_server `& `notes_prisma_studio`

#### 5. import and use types from Prisma Client

`src/generated/prisma/index.d.ts`

```ts
export { type CustomModel, CustomEnum, $Enums } from "@/generated/prisma";
```

## Links

Local URL:

- Next.js Server: `http://localhost:7000`
- Prisma Studio: `http://localhost:7200`

Production URL:

- Next.js Server: ?
- Neon Dashboard: https://console.neon.tech/app/projects/rapid-wind-17917783
- Neon DB Tables: https://console.neon.tech/app/projects/rapid-wind-17917783/branches/br-white-sea-a4e11kkz/tables
