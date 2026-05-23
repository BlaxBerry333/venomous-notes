import Link from 'next/link'
import { StatusShell } from '@/components/error/StatusShell'
import { StatusPage, STATUS_PRIMARY, STATUS_QUIET } from '@/components/error/StatusPage'

/**
 * 根 not-found——URL 完全不匹配任何路由组时落到此页。
 * Next.js 强制根 not-found 必须挂 app/ 直接子级，不能放进任何路由组。
 * 外层套 StatusShell 提供简化版顶栏。
 */
export default function NotFound() {
  return (
    <StatusShell>
      <StatusPage
        code="404"
        title="找不到此页面"
        description="你访问的笔记或思维导图可能已被删除，或地址输入有误。"
      >
        <Link href="/" className={STATUS_PRIMARY} replace>
          返回首页
        </Link>
      </StatusPage>
    </StatusShell>
  )
}
