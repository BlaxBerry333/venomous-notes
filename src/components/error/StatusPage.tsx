/**
 * 错误/状态页主区内容——居中状态码 / 标题 / 描述 / 按钮；
 * 外层套 StatusShell 提供顶栏，本组件只管主区，flex-1 撑满 main 剩余高度。
 */

export const STATUS_PRIMARY =
  'bg-accent text-bg inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-[13px] font-medium transition hover:opacity-90 disabled:opacity-50'

export const STATUS_QUIET =
  'text-muted hover:text-fg border-border hover:border-border2 inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-[13px] transition'

export function StatusPage({
  code,
  title,
  description,
  children,
}: {
  code: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="text-accent font-mono text-[88px] leading-none font-light tracking-[-0.03em] max-md:text-[64px]">
        {code}
      </div>
      <h1 className="text-fg mt-5 text-[22px] font-semibold tracking-[-0.01em]">{title}</h1>
      <p className="text-muted mt-2 max-w-[460px] text-[14px] leading-relaxed">{description}</p>
      {children && <div className="mt-7 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  )
}
