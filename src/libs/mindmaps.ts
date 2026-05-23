/**
 * 思维导图数据访问层——读 content/mindmaps 目录、解析 JSON
 * 与 NOTES 平行，不共享实现（仅共享 NavNode 这一通用类型）
 */

import fs from 'fs'
import path from 'path'
import { cache } from 'react'
import type { MindmapMeta, MindmapSource, NavNode } from '@/types'

const __MINDMAPS_ROOT = path.join(process.cwd(), 'content/mindmaps')

function __readMindmapJson(filePath: string): MindmapSource | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as MindmapSource
  } catch {
    return null
  }
}

function __buildMindmapsTree(dir: string, prefix: string[] = []): NavNode[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const nodes: NavNode[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    if (entry.isDirectory()) {
      const children = __buildMindmapsTree(path.join(dir, entry.name), [...prefix, entry.name])
      if (children.length > 0) nodes.push({ type: 'folder', name: entry.name, children })
    } else if (entry.name.endsWith('.json')) {
      const base = entry.name.replace(/\.json$/, '')
      const filePath = path.join(dir, entry.name)
      const source = __readMindmapJson(filePath)
      nodes.push({
        type: 'file',
        name: base,
        title: source?.title,
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

function __collectMindmapFiles(nodes: NavNode[]): NavNode[] {
  return nodes.flatMap((n) => (n.type === 'file' ? [n] : __collectMindmapFiles(n.children ?? [])))
}

function __findMindmapBySlug(nodes: NavNode[], target: string): NavNode | null {
  for (const n of nodes) {
    if (n.type === 'file' && n.slug === target) return n
    if (n.children) {
      const found = __findMindmapBySlug(n.children, target)
      if (found) return found
    }
  }
  return null
}

const __getMindmapsNavTree = cache<() => NavNode[]>(() => __buildMindmapsTree(__MINDMAPS_ROOT))

const __getAllMindmapMeta = cache<() => MindmapMeta[]>(() => {
  return __collectMindmapFiles(__getMindmapsNavTree())
    .map((node) => {
      const source = __readMindmapJson(node.path!)
      return {
        slug: node.slug!.split('/'),
        title: source?.title ?? node.name,
        date: source?.date ? new Date(source.date).toISOString() : new Date(0).toISOString(),
        tags: source?.tags ?? [],
        description: source?.description,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

export const MINDMAPS = {
  // 获取导航树
  getMindmapsNavTree: __getMindmapsNavTree,

  // 获取元数据
  getAllMindmapMeta: __getAllMindmapMeta,

  // 获取单个导图内容
  getMindmapSource: (slug: string[]): MindmapSource | null => {
    const node = __findMindmapBySlug(__getMindmapsNavTree(), slug.join('/'))
    if (!node?.path) return null
    return __readMindmapJson(node.path)
  },

  // 给 generateStaticParams 用
  getAllMindmapSlugs: (): string[][] =>
    __collectMindmapFiles(__getMindmapsNavTree()).map((n) => n.slug!.split('/')),
}
