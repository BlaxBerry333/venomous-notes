/**
 * 笔记数据访问层——读 content/notes 目录、解析 frontmatter
 * React `cache` 包裹的方法同一请求内多次调用复用结果
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import type { NavNode, NoteMeta } from '@/types'
import { MARKDOWN } from './markdown'

const __NOTES_ROOT = path.join(process.cwd(), 'content/notes')

function __buildNotesTree(dir: string, prefix: string[] = []): NavNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const nodes: NavNode[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    if (entry.isDirectory()) {
      const children = __buildNotesTree(path.join(dir, entry.name), [...prefix, entry.name])
      if (children.length > 0) nodes.push({ type: 'folder', name: entry.name, children })
    } else if (/\.(mdx|md)$/.test(entry.name)) {
      const base = entry.name.replace(/\.(mdx|md)$/, '')
      const filePath = path.join(dir, entry.name)
      let title: string | undefined
      try {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { content, data } = matter(raw)
        title = (data.title as string | undefined) ?? MARKDOWN.extractH1(content)
      } catch {
        // ignore read errors
      }
      nodes.push({
        type: 'file',
        name: base,
        title,
        slug: [...prefix, base].join('/'),
        path: filePath,
      })
    }
  }

  // folder 在前，同类按字母序
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

function __collectNoteFiles(nodes: NavNode[]): NavNode[] {
  return nodes.flatMap((n) => (n.type === 'file' ? [n] : __collectNoteFiles(n.children ?? [])))
}

function __findNoteBySlug(nodes: NavNode[], target: string): NavNode | null {
  for (const n of nodes) {
    if (n.type === 'file' && n.slug === target) return n
    if (n.children) {
      const found = __findNoteBySlug(n.children, target)
      if (found) return found
    }
  }
  return null
}

const __getNotesNavTree = cache<() => NavNode[]>(() => {
  if (!fs.existsSync(__NOTES_ROOT)) return []
  return __buildNotesTree(__NOTES_ROOT)
})

const __getAllNoteMeta = cache<() => NoteMeta[]>(() => {
  return __collectNoteFiles(__getNotesNavTree())
    .map((node) => {
      const raw = fs.readFileSync(node.path!, 'utf-8')
      const { content, data } = matter(raw)
      return {
        slug: node.slug!.split('/'),
        title: (data.title as string) ?? MARKDOWN.extractH1(content) ?? node.name,
        date: data.date ? new Date(data.date as string).toISOString() : new Date(0).toISOString(),
        tags: (data.tags as string[]) ?? [],
        description: data.description as string | undefined,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

export const NOTES = {
  // 获取导航
  getNotesNavTree: __getNotesNavTree,

  // 获取元数据
  getAllNoteMeta: __getAllNoteMeta,

  // 获取文档内容
  getNoteSource: (
    slug: string[],
  ): { content: string; frontmatter: Record<string, unknown> } | null => {
    const node = __findNoteBySlug(__getNotesNavTree(), slug.join('/'))
    if (!node?.path) return null
    const { content, data } = matter(fs.readFileSync(node.path, 'utf-8'))
    return { content, frontmatter: data }
  },

  // 给 generateStaticParams 用
  getAllNoteSlugs: (): string[][] =>
    __collectNoteFiles(__getNotesNavTree()).map((n) => n.slug!.split('/')),
}
