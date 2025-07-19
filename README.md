# Venomous Notes

Venomous Notes is a containerized full-stack note-taking app with a clean architecture and developer-friendly setup.

Just a project for practice. Can’t bring myself to spend a ton of money putting this on the big cloud platforms, they’re \*\*\*\*ing crazy expensive! so please go easy on me.

## Overview

| Server                | Port | Main Skills                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------- | :--: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server                | 7000 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-frontend--nextjs.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-backend--trpc.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--prisma.png?raw=true" style="width:40px;" /> |
| DataBase              | 7100 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--postgresql.png?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                        |
| Prisma Studio ( Dev ) | 7200 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--prisma.png?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                            |
| MinIO                 | 7300 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--minio.png?raw=true" style="width:40px;" />                                                                                                                                                                                                                                                                                                                             |
| MinIO Console ( Dev ) | 7301 | <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/web-infrastructure--docker.png?raw=true" style="width:40px;" /> <img src="https://github.com/BlaxBerry333/programming-notes/blob/main/docs/public/static/skill-icons/database--minio.png?raw=true"  style="width:40px;" />                                                                                                                                                                                                                                                                                                                            |

<!-- ## Features

- [ ] memo notes
- [x] stories collection
- [ ] foreign language study -->

<!-- ## Tech Stack

Main:

- [Next.js]()
- [TypeScript]()
- [TRPC]()
- [Prisma]()

Others:

- [Zod]()
- [Tanstack Query]()
- [NextAuth]() -->

## Folder Structure

```
.
├── .husky/
│   └── ...
│
├── docker/
│   ├── docker-compose.<mode>.yml
│   ├── Dockerfile.<mode>
│   └── ...
│
├── envs/
│   ├── .env.<mode>
│   └── ...
│
├── prisma/
│   ├── migrations/
│   │   └── ...
│   └── schema.prisma
│
├── src/
│   ├── .generated/
│   │   └── prisma/       # prisma client
│   │       └── ...
│   │
│   ├── app/
│   │   └── ...
│   │
│   ├── client/
│   │   ├── ui/
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── server/
│   │   ├── routes/       # trpc procedures
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── prisma/
│   │   │   ├── trpc/
│   │   │   └── ...
│   │   └── ...
│   │
│   └── types/
│       └── ...
│
├── Makefile
├── next.config.mjs
├── tsconfig.json
├── package.json
└── ...
```

## Commands

### Local Setup

```shell
# 1. clone then go to the directory
git clone https://github.com/BlaxBerry333/venomous-notes.git
cd venomous-notes

# 2. config ENV variables
# ...

# 3. setup containers
make setup-all            # dev environment
make setup-all ENV=dev    # dev environment
make setup-all ENV=prod   # prod environment
```

### Migration

```shell
make entry CONTAINER=notes_server
# create migration file
/usr/src/app # npx prisma migrate dev --name <MIGRATION_NAME>
# migrate and update client
/usr/src/app # npx prisma migrate deploy

```
