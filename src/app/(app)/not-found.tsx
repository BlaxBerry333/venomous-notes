import Link from 'next/link'
import { StatusShell } from '@/components/error/StatusShell'
import { StatusPage, STATUS_PRIMARY, STATUS_QUIET } from '@/components/error/StatusPage'

/**
 * (app) 组内的 not-found——(with-shell)/<任一 page> 调 notFound() 时落到此页；
 * 因挂在 (app) 层（非 (with-shell) 层），渲染时只经过 (app)/layout.tsx 即 pass-through，
 * 不经过 (with-shell)/layout.tsx，故无 AppShell（无侧栏/无面包屑）；
 * 外层套 StatusShell 提供简化版顶栏（品牌 + 主题切换 + GitHub）。
 */
export default function AppNotFound() {
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
        <Link href="/notes" className={STATUS_QUIET} replace>
          浏览笔记
        </Link>
      </StatusPage>
    </StatusShell>
  )
}
