/** 文档头 · design-spec §1 [doc-header] —— 衬线 H1 + 分类/标签（无 eyebrow） */
export function DocHeader({
  title,
  category,
  tags,
}: {
  title: string
  category: string
  tags: string[]
}) {
  return (
    <header className="mb-9">
      <h1 className="font-display text-fg m-0 mb-[18px] text-[38px] leading-[1.15] font-[480] tracking-[-0.02em] max-md:text-[29px]">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-accent bg-primary-light border-primary-border inline-flex items-center rounded-md border px-[9px] py-0.5 text-[11px] font-medium tracking-[0.01em] whitespace-nowrap transition duration-[250ms]">
          {category}
        </span>
        {tags.map((t) => (
          <span
            className="text-muted bg-surface border-border inline-flex items-center rounded-md border px-[9px] py-0.5 text-[11px] font-medium tracking-[0.01em] whitespace-nowrap transition duration-[250ms]"
            key={t}
          >
            {t}
          </span>
        ))}
      </div>
    </header>
  )
}
