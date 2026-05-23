'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

const NOTES_ROOT = path.join(process.cwd(), 'content/notes')
const SLUG_PART_RE = /^[a-zA-Z0-9\-_]+$/

function __isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}

/** 把 slug 段解析成绝对文件路径（固定 `.md` 扩展）；非法（含 `..`、特殊字符、越界）返回 null */
function __safeResolve(slug: string[]): string | null {
  if (slug.length === 0) return null
  if (!slug.every((s) => s && SLUG_PART_RE.test(s))) return null
  const filePath = path.join(NOTES_ROOT, ...slug.slice(0, -1), `${slug.at(-1)}.md`)
  const resolved = path.resolve(filePath)
  const root = path.resolve(NOTES_ROOT)
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null
  return resolved
}

type NoteInitial = {
  title: string
  date: string
  tags: string[]
}

/** schema 校验：title/date 非空字符串、tags 字符串数组 */
function __validateInitial(initial: unknown): initial is NoteInitial {
  if (!initial || typeof initial !== 'object') return false
  const v = initial as NoteInitial
  if (typeof v.title !== 'string' || !v.title) return false
  if (typeof v.date !== 'string' || !v.date) return false
  if (!Array.isArray(v.tags) || !v.tags.every((t) => typeof t === 'string')) return false
  return true
}

/** 序列化为 markdown（frontmatter + H1 占位 body） */
function __serialize(initial: NoteInitial): string {
  const tagsLine = `tags: [${initial.tags.map((t) => JSON.stringify(t)).join(', ')}]`
  return `---\ntitle: ${initial.title}\ndate: ${initial.date}\n${tagsLine}\n---\n\n# ${initial.title}\n`
}

export async function createNote(
  slug: string[],
  initial: NoteInitial,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!__isDev()) return { ok: false, error: '编辑功能仅在 dev 模式可用' }
  const target = __safeResolve(slug)
  if (!target) return { ok: false, error: '非法 slug' }
  // 同名 .md / .mdx 都视为已存在，防止侧栏出现双胞胎
  const mdxNeighbor = target.replace(/\.md$/, '.mdx')
  if (fs.existsSync(target) || fs.existsSync(mdxNeighbor)) {
    return { ok: false, error: '同名文件已存在' }
  }
  if (!__validateInitial(initial)) return { ok: false, error: '初始数据格式不合法' }
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, __serialize(initial), 'utf-8')
  } catch {
    return { ok: false, error: '创建失败' }
  }
  revalidatePath('/notes')
  return { ok: true }
}
