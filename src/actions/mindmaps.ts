'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import type { MindmapSource } from '@/types'

const MINDMAPS_ROOT = path.join(process.cwd(), 'content/mindmaps')
const SLUG_PART_RE = /^[a-zA-Z0-9\-_]+$/

function __isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}

/** 把 slug 段解析成绝对文件路径；非法（含 `..`、特殊字符、越界）返回 null */
function __safeResolve(slug: string[]): string | null {
  if (slug.length === 0) return null
  if (!slug.every((s) => s && SLUG_PART_RE.test(s))) return null
  const filePath = path.join(MINDMAPS_ROOT, ...slug.slice(0, -1), `${slug.at(-1)}.json`)
  const resolved = path.resolve(filePath)
  const root = path.resolve(MINDMAPS_ROOT)
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null
  return resolved
}

/** schema 校验：id 唯一 + edge 引用必须存在 */
function __validateSource(source: unknown): source is MindmapSource {
  if (!source || typeof source !== 'object') return false
  const s = source as MindmapSource
  if (!Array.isArray(s.nodes) || !Array.isArray(s.edges)) return false
  const ids = new Set<string>()
  for (const n of s.nodes) {
    if (!n || typeof n.id !== 'string' || !n.id) return false
    if (ids.has(n.id)) return false
    ids.add(n.id)
    if (!n.data || typeof n.data.label !== 'string') return false
  }
  for (const e of s.edges) {
    if (!e || typeof e.source !== 'string' || typeof e.target !== 'string') return false
    if (!ids.has(e.source) || !ids.has(e.target)) return false
  }
  return true
}

/** 去掉 position / 多余字段，只持久化逻辑结构 */
function __normalize(source: MindmapSource): MindmapSource {
  return {
    title: source.title,
    date: source.date,
    tags: source.tags ?? [],
    description: source.description,
    nodes: source.nodes.map((n) => ({ id: n.id, data: { label: n.data.label } })),
    edges: source.edges.map((e) => ({ source: e.source, target: e.target })),
  }
}

export async function saveMindmap(
  slug: string[],
  source: MindmapSource,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!__isDev()) return { ok: false, error: '编辑功能仅在 dev 模式可用' }
  const target = __safeResolve(slug)
  if (!target) return { ok: false, error: '非法 slug' }
  if (!fs.existsSync(target)) return { ok: false, error: '文件不存在' }
  if (!__validateSource(source)) {
    return { ok: false, error: '数据格式不合法（节点 ID 重复 / 边引用不存在）' }
  }
  try {
    fs.writeFileSync(target, JSON.stringify(__normalize(source), null, 2) + '\n', 'utf-8')
  } catch {
    return { ok: false, error: '写入失败' }
  }
  revalidatePath(`/mindmaps/${slug.join('/')}`)
  return { ok: true }
}

export async function deleteMindmap(
  slug: string[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!__isDev()) return { ok: false, error: '编辑功能仅在 dev 模式可用' }
  const target = __safeResolve(slug)
  if (!target) return { ok: false, error: '非法 slug' }
  if (!fs.existsSync(target)) return { ok: false, error: '文件不存在' }
  try {
    fs.unlinkSync(target)
  } catch {
    return { ok: false, error: '删除失败' }
  }
  revalidatePath('/mindmaps')
  return { ok: true }
}

export async function createMindmap(
  slug: string[],
  initial: MindmapSource,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!__isDev()) return { ok: false, error: '编辑功能仅在 dev 模式可用' }
  const target = __safeResolve(slug)
  if (!target) return { ok: false, error: '非法 slug' }
  if (fs.existsSync(target)) return { ok: false, error: '同名文件已存在' }
  if (!__validateSource(initial)) return { ok: false, error: '初始数据格式不合法' }
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, JSON.stringify(__normalize(initial), null, 2) + '\n', 'utf-8')
  } catch {
    return { ok: false, error: '创建失败' }
  }
  revalidatePath('/mindmaps')
  return { ok: true }
}
