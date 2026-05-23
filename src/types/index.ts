export interface NavNode {
  type: 'file' | 'folder'
  name: string
  title?: string // files: frontmatter title or H1 (falls back to name)
  slug?: string // files: 'react/hooks'
  path?: string // files: absolute fs path
  children?: NavNode[]
}

export interface NoteMeta {
  slug: string[]
  title: string
  date: string
  tags: string[]
  description?: string
}

export interface TocItem {
  id: string
  text: string
  depth: number
}
