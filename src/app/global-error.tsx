'use client'

import { useEffect } from 'react'

/**
 * global-error 兜底——仅在 root layout (app/layout.tsx) 自身渲染抛错时触发，
 * 此时整个 React 树（含 html/body）尚未建立，必须由本组件自己产 <html><body>。
 * 不能依赖任何 layout 提供的上下文（ThemeProvider 不在），故用纯 CSS variables（globals.css 仍能加载）
 * + 内联样式兜底，避免再叠加 hydration 风险。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[global error]', error)
    }
  }, [error])

  return (
    <html lang="zh-CN">
      <body>
        <div className="bg-bg text-fg flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
          <div className="text-accent font-mono text-[88px] leading-none font-light tracking-[-0.03em] max-md:text-[64px]">
            500
          </div>
          <h1 className="text-fg mt-5 text-[22px] font-semibold tracking-[-0.01em]">应用崩溃了</h1>
          <p className="text-muted mt-2 max-w-[460px] text-[14px] leading-relaxed">
            页面遇到了严重错误，刷新可能恢复正常。
          </p>
          <button
            type="button"
            onClick={reset}
            className="bg-accent text-bg mt-7 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-[13px] font-medium transition hover:opacity-90"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  )
}
