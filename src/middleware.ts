import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parseMaintenanceUntilMs } from '@/libs/maintenance'

/**
 * 维护模式门禁（环境变量驱动，重启即生效）：
 * - MAINTENANCE_MODE=on → 全站 rewrite 到 /maintenance（URL 不变）；/api/* 返回 503 JSON；静态资源放行
 * - 否则                → 裸访问 /maintenance 重定向回 /（防直接命中维护页）
 */

const MAINTENANCE_PATH = '/maintenance'

export function middleware(req: NextRequest) {
  const maintenanceOn = process.env.MAINTENANCE_MODE === 'on'
  const { pathname } = req.nextUrl

  if (maintenanceOn) {
    // 维护页自身放行（否则会无限 rewrite 循环）
    if (pathname === MAINTENANCE_PATH) return NextResponse.next()

    // 给爬虫/客户端正确信号；MAINTENANCE_UNTIL 存在时附 Retry-After（秒）
    const targetMs = parseMaintenanceUntilMs(process.env.MAINTENANCE_UNTIL)
    const retryAfter = targetMs > 0 ? Math.max(0, Math.floor((targetMs - Date.now()) / 1000)) : 0

    // API 走 503 JSON——不能 rewrite 到 HTML 维护页（调用方会 JSON.parse 炸）
    if (pathname.startsWith('/api/')) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json; charset=utf-8',
        'x-maintenance': '1',
      }
      if (retryAfter > 0) headers['Retry-After'] = String(retryAfter)
      return new NextResponse(JSON.stringify({ error: 'maintenance', message: '服务维护中' }), {
        status: 503,
        headers,
      })
    }

    // 其余请求 rewrite 到维护页（URL 不变）
    const url = req.nextUrl.clone()
    url.pathname = MAINTENANCE_PATH
    const res = NextResponse.rewrite(url)
    res.headers.set('x-maintenance', '1')
    if (retryAfter > 0) res.headers.set('Retry-After', String(retryAfter))
    return res
  }

  // 维护模式关闭：禁止任何来源直接访问 /maintenance
  if (pathname === MAINTENANCE_PATH) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
