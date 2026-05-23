'use client'

import { createContext, useContext, useEffect, useState } from 'react'

/* 主题上下文 · design-spec §4.5 —— 浅色 / 深色，localStorage 持久化
   首渲固定 'light'（SSR 安全 + 无 hydration mismatch）；
   挂载后从 <html> 类（inline 脚本已设）读真实主题；写回 effect 跳过首次，
   避免覆盖 inline 脚本设的类导致整页闪烁 */
type Theme = 'light' | 'dark'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
}

const Ctx = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} })

const STORAGE_KEY = 'vn-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // 挂载后读 inline 脚本已落地的真实主题
  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    setMounted(true)
  }, [])

  // 写回：跳过首次（mounted 前），避免清掉 inline 脚本设的 .dark
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme, mounted])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export function useTheme() {
  return useContext(Ctx)
}
