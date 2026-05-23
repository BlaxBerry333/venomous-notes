'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { StatusShell } from '@/components/error/StatusShell'
import { StatusPage, STATUS_PRIMARY, STATUS_QUIET } from '@/components/error/StatusPage'

/**
 * 根级运行时错误兜底——(app)/error.tsx 接不住的（如 (status)/page、(auth)/login 等组内抛错）冒到这里。
 * Next.js 强制根 error 必须挂 app/ 直接子级；外层套 StatusShell 提供简化版顶栏。
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[root error]', error)
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
