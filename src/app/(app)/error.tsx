'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { StatusShell } from '@/components/error/StatusShell'
import { StatusPage, STATUS_PRIMARY, STATUS_QUIET } from '@/components/error/StatusPage'

/**
 * (app) 组内运行时错误兜底——(with-shell)/<任一 page> 抛错时落到此处；
 * error.tsx 替换 (with-shell)/layout 及其下子树，故无 AppShell（无侧栏/无面包屑）；
 * 外层套 StatusShell 提供简化版顶栏。
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[app error]', error)
    }
  }, [error])

  return (
    <StatusShell>
      <StatusPage
        code="500"
        title="服务器出错了"
        description="刚刚出了点意外，可以重试一下，或者返回首页换个入口。"
      >
        <button type="button" onClick={reset} className={STATUS_PRIMARY}>
          重试
        </button>
        <Link href="/" className={STATUS_QUIET} replace>
          返回首页
        </Link>
      </StatusPage>
    </StatusShell>
  )
}
