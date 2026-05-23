import type { Metadata } from 'next'
import { StatusShell } from '@/components/error/StatusShell'

/**
 * 状态页路由组 layout——统一套 StatusShell（简化版顶栏，无侧栏/无面包屑）；
 * 加 noindex 防搜索引擎收录这类临时页。
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return <StatusShell>{children}</StatusShell>
}
