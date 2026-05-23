import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import type { Metadata } from 'next'
import { Icon } from '@iconify/react'
import { NOTES } from '@/libs/notes'
import { MARKDOWN } from '@/libs/markdown'
import { TableOfContents } from '@/components/layout/TableOfContents'
import { DocHeader } from '@/components/notes/DocHeader'
import { DocPager } from '@/components/notes/DocPager'
import { Callout } from '@/components/mdx/Callout'
import { CodeBlock } from '@/components/mdx/CodeBlock'

type Props = { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  return NOTES.getAllNoteSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const note = NOTES.getNoteSource(slug)
  const title =
    (note?.frontmatter?.title as string) ??
    (note ? MARKDOWN.extractH1(note.content) : undefined) ??
    slug.at(-1)
  return { title }
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params
  const note = NOTES.getNoteSource(slug)
  if (!note) notFound()

  const fm = note.frontmatter as { title?: string; date?: string; tags?: string[] }
  const slugStr = slug.join('/')
  const title = fm.title ?? MARKDOWN.extractH1(note.content) ?? slug.at(-1) ?? '文档'
  const category = slug[0] ?? 'general'
  const tags = fm.tags ?? []
  const toc = MARKDOWN.extractToc(note.content)
  // 去掉正文开头的 H1——标题已由 DocHeader 渲染（仅匹配字符串开头，不误删中部标题）
  const body = note.content.replace(/^\s*# [^\n]+\r?\n?/, '')

  const all = NOTES.getAllNoteMeta()
  const idx = all.findIndex((n) => n.slug.join('/') === slugStr)
  const prev = idx > 0 ? all[idx - 1] : undefined
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined

  const dateLabel = fm.date
    ? new Date(fm.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : null

  return (
    <div className="mx-auto flex max-w-[1060px] gap-14 px-12 pt-14 pb-24 max-md:flex-col max-md:gap-0 max-md:px-5 max-md:pt-8 max-md:pb-16">
      <article className="max-w-[720px] min-w-0 flex-1">
        <DocHeader title={title} category={category} tags={tags} />

        <div className="prose">
          <MDXRemote
            source={body}
            options={{
              mdxOptions: {
                // 内容为纯 CommonMark .md（无 JSX 组件）——按 md 解析，
                // 否则 prose 里的裸 `<50` 等会被误判为 JSX 标签而编译失败
                format: 'md',
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode as never, { theme: 'github-dark', keepBackground: false }],
                ],
              },
            }}
            components={{
              Callout,
              pre: CodeBlock as never,
              table: (props: React.HTMLAttributes<HTMLTableElement>) => (
                <div className="max-w-full overflow-x-auto">
                  <table {...props} />
                </div>
              ),
            }}
          />
        </div>

        {dateLabel && (
          <div className="border-border text-muted mt-14 flex items-center gap-[7px] border-t pt-5 font-mono text-[12.5px]">
            <Icon icon="ph:clock-counter-clockwise" width={13} height={13} aria-hidden="true" />
            最后更新 · {dateLabel}
          </div>
        )}

        <DocPager
          prev={prev ? { title: prev.title, slug: prev.slug.join('/') } : undefined}
          next={next ? { title: next.title, slug: next.slug.join('/') } : undefined}
        />
      </article>

      {toc.length > 0 && <TableOfContents toc={toc} />}
    </div>
  )
}
