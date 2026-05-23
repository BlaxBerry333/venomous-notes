import Link from 'next/link'
import type { Metadata } from 'next'
import { StatusPage, STATUS_PRIMARY } from '@/components/error/StatusPage'

export const metadata: Metadata = { title: '页面已迁移' }

/**
 * 页面已迁移页（独立路由 /moved）——挂在 (status) 路由组，不进 AppShell，故不带面包屑/侧栏；
 * 用 302 数字表达「临时重定向 / 地址变更」
 */
export default function MovedPage() {
  return (
    <StatusPage
      code="302"
      title="页面已迁移"
      description="此页面的地址已变更，点击下方按钮跳转到新位置。"
    >
      <Link href="/" className={STATUS_PRIMARY} replace>
        跳转新地址
      </Link>
    </StatusPage>
  )
}
