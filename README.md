# venomous-notes

[![Next.js](https://img.shields.io/badge/Next.js-20232A?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-20232A?logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-20232A?logo=tailwindcss&logoColor=06B6D4)](https://tailwindcss.com/)
[![MDX](https://img.shields.io/badge/MDX-20232A?logo=mdx&logoColor=F9AC00)](https://mdxjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-20232A?logo=framer&logoColor=0055FF)](https://www.framer.com/motion/)

A personal knowledge base that consolidates Markdown notes and mind maps in one place for easy reference.

## Motivation

I wanted a single place to drop my notes and revisit them later. Off-the-shelf site generators like VitePress, Docusaurus and Nextra would do the job, but as a frontend developer I'd rather build my own — owning the routing, content pipeline, styling and interactions end to end.

Since I'm building from scratch, mind maps are treated as a first-class note format too: Markdown for linear prose, mind maps for structural relationships, both browsed from the same site.

> Scoped for personal use for now. Convention over configuration: folder = menu, filename = slug, no admin UI.

## Stack

- **Framework** — Next.js 15 (App Router, Turbopack dev) + React 19
- **Language** — TypeScript 5.8 (strict)
- **Styling** — Tailwind CSS v4
- **Markdown pipeline** — `next-mdx-remote/rsc`, `remark-gfm`, `rehype-pretty-code`, `rehype-slug`, `shiki`
- **Minmaps** — `@xyflow/react`, `dagre`
- **Motion** — `framer-motion`

## Content

### Notes

Notes are Markdown files under `content/notes/<category>/<slug>.md`.

Rendered through `next-mdx-remote/rsc` with GFM, syntax highlighting and an auto-generated TOC from H2–H4.

Optional frontmatter is supported:

```yaml
---
title: Overrides the first H1
date: 2026-01-01
tags: [go, gin]
description: Short summary
---
```

---

### Mind maps

Mind maps are JSON files under `content/mindmaps/<category>/<slug>.json`,

rendered by `@xyflow/react` with automatic layout via `dagre`.

```ts
type MindmapSource = {
  title?: string
  date?: string
  tags?: string[]
  description?: string
  nodes: Node[]
  edges: Edge[]
}

type Node = {
  id: string
  data: { label: string }
  [k: string]: unknown
}

type Edge = {
  id?: string
  source: string
  target: string
  [k: string]: unknown
}
```
