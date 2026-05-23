/** 维护模式工具——edge-runtime safe（无 Node-only 依赖），可被 middleware 直接 import */

/** 解析 MAINTENANCE_UNTIL → epoch ms。
 *  支持 `YYYY-MM-DD HH:mm[:ss]`（无时区标识 = 服务器本地时区）与 ISO 8601；无效/缺省返回 0。 */
export function parseMaintenanceUntilMs(raw: string | undefined): number {
  if (!raw) return 0
  // 把 'YYYY-MM-DD HH:mm' 形式空格换成 T，让 new Date 走 ISO 路径
  const t = new Date(raw.trim().replace(' ', 'T')).getTime()
  return Number.isFinite(t) ? t : 0
}
