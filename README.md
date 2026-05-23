# venomous-notes

## Stack

| Layer     | Choice                                               |
| --------- | ---------------------------------------------------- |
| Framework | Next.js 15 (App Router) + React 19                   |
| Language  | TypeScript 5.8                                       |
| Styling   | Tailwind CSS v4                                      |
| Content   | File-system notes rendered via `next-mdx-remote/rsc` |
| Markdown  | remark-gfm, rehype-pretty-code, rehype-slug          |

## Layout

```
.
├── content/
│   ├── notes/            # markdown notes (grouped by topic)
│   └── ...
├── public/
├── src/
│   ├── app/              # Next App Router routes
│   │   └── ...
│   ├── components/
│   │   └── ...
│   ├── libs/
│   │   ├── fonts.ts      # next/font instances + CSS variables
│   │   ├── site.ts       # site metadata (derived from package.json)
│   │   ├── notes.ts      # notes data access (NOTES.*)
│   │   ├── markdown.ts   # markdown extraction (MARKDOWN.*)
│   │   └── ai.ts         # AI model + system prompts
│   ├── types/            # shared types
│   ├── mdx-components.tsx
│   └── middleware.ts
├── .github/workflows/    # CI
├── .husky/               # git hooks
├── .cspell/              # cspell project dictionary
└── .vscode/              # vscode settings
```

## Tooling

- [x] ESLint 9 (flat config, Next + typescript-eslint + Prettier off)
- [x] Prettier 3 + `prettier-plugin-tailwindcss`
- [x] cspell 8 + project dictionary
- [x] TypeScript strict mode
- [x] husky + lint-staged + commitlint (Conventional Commits)
- [x] CI quality checks (`.github/workflows/quality-check.yml`) — runs on any push / PR, 4 parallel jobs

## Adding content

Drop a markdown file at `content/notes/<category>/<slug>.md` and restart dev. Optional frontmatter:

TOC is auto-generated from H2–H4.

```yaml
---
title: Custom title (falls back to first H1)
date: 2026-01-01
tags: [go, gin]
description: short summary
---
```
