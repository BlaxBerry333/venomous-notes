'use client'

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react'

/**
 * 主题上下文 · design-spec §4.5 —— 浅色 / 深色，localStorage 持久化
 * DOM (<html>.dark) 是唯一真源：inline 脚本在 SSR 后立即设定，
 * React 端用 useSyncExternalStore 订阅 class 变化，零 effect-setState，零 hydration 闪烁
 */
type Theme = 'light' | 'dark'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
}

const Ctx = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} })

const STORAGE_KEY = 'vn-theme'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export function useTheme() {
  return useContext(Ctx)
}
