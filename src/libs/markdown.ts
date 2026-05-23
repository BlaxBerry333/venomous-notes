import GithubSlugger from 'github-slugger'
import type { TocItem } from '@/types'

type Heading = { depth: number; text: string }

/**
 * 抓 markdown 标题（h1–h6），跳过代码围栏内的伪标题
 * @param depth 单一深度（1 = 只 H1）或闭区间 [min, max]
 */
function __parseHeadings(markdown: string, depth: number | [number, number] = [1, 6]): Heading[] {
  const [min, max] = typeof depth === 'number' ? [depth, depth] : depth
  const result: Heading[] = []
  let inFence = false

  for (const line of markdown.split('\n')) {
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const m = line.match(/^(#{1,6})\s+(.+)/)
    if (!m) continue
    const d = m[1].length
    if (d < min || d > max) continue
    result.push({ depth: d, text: m[2].replace(/[`*_[\]]/g, '').trim() })
  }
  return result
}

function __extractH1(markdown: string): string | undefined {
  return __parseHeadings(markdown, 1)[0]?.text
}

function __extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger()
  return __parseHeadings(markdown, [2, 4]).map((h) => ({
    ...h,
    id: slugger.slug(h.text),
  }))
}

export const MARKDOWN = {
  /** 抓 markdown 标题（h1–h6），跳过代码围栏；可指定单一深度或闭区间 */
  parseHeadings: __parseHeadings,

  /** 抓首个 `# H1` 文本，页面 title fallback 用 */
  extractH1: __extractH1,

  /** 抓 H2–H4 目录项，跳过代码围栏 */
  extractToc: __extractToc,
}
