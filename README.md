# Venomous Notes

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
  - [Local Setup](#local-setup)
  - [Schema Changing & Migration](#schema-changing--migration)

## Overview

...

## Tech Stack

|               | Port | Main Skills                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server        | 7000 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-frontend--nextjs.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-backend--trpc.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--prisma.png?raw=true" style="width:40px;" /> |
| DataBase      | 7100 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--postgresql.png?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                        |
| Prisma Studio | 7200 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--prisma.png?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                            |

- next.js v15
- zod v3
- tRPC v11
- prisma v6
- react-query v5

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

#### 4. restart Docker container of server and db ( `notes_server`&`notes_prisma_studio` )

#### 5. import and use types from Prisma Client ( `src/generated/prisma/index.d.ts` )

```ts
export { type CustomModel, CustomEnum } from "@/generated/prisma";
```
