import type { Metadata } from 'next'
import { StatusPage } from '@/components/error/StatusPage'
import { MaintenanceCountdown } from '@/components/error/MaintenanceCountdown'
import { parseMaintenanceUntilMs } from '@/libs/maintenance'

export const metadata: Metadata = { title: '维护中' }

/**
 * 维护中页——访问门禁见 src/middleware.ts；故意不放跳转按钮（维护期间跳哪都没用）。
 * MAINTENANCE_UNTIL 在 server 端解析成 epoch ms 后传给 client 组件——避免两端 string 解析的时区分歧。
 */
export default function MaintenancePage() {
  const untilMs = parseMaintenanceUntilMs(process.env.MAINTENANCE_UNTIL)
  return (
    <StatusPage
      code="503"
      title="正在维护"
      description="我们正在升级一些功能，预计很快回来。请稍后再来看看。"
    >
      {untilMs > 0 && <MaintenanceCountdown untilMs={untilMs} />}
    </StatusPage>
  )
}
