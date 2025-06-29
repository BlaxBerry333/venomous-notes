# Venomous Notes

|               | Port | Main Skills                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server        | 7000 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-frontend--nextjs.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-backend--trpc.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--prisma.png?raw=true" style="width:40px;" /> |
| DataBase      | 7100 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--postgresql.png?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                        |
| Prisma Studio | 7200 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--prisma.png?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                            |

## Tech Stack

- next.js v15
- zod v3
- tRPC v11
- prisma v6
- react-query v5

## Commands

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

### Schema Changed

1. change `/prisma/schema.prisma`
2. generate types

```zsh
% make entry CONTAINER=notes_server
/usr/src/app # npx prisma generate
```

3. import and use in react

```ts
export type { SomeType } from "@/generated/prisma"; // src/generated/prisma/index.d.ts
```

### Migration

```zsh
% make entry CONTAINER=notes_server
/usr/src/app # npx prisma migrate dev --name [MIGRATION_NAME]
/usr/src/app # npx prisma db push
```
