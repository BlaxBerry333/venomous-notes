/**
 * (app) 路由组 layout——pass-through，仅作 segment 边界：
 * 让 (app)/not-found.tsx 和 (app)/error.tsx 在此层兜底，不进 (with-shell)/layout.tsx 即无 AppShell。
 * ThemeProvider 已上提到 root layout，本层无需再包。
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
