'use client'

import { Icon } from '@iconify/react'
import { useTheme } from './ThemeProvider'

/* 主题切换 · design-spec §4.5 —— header 内浅 / 深一键切换 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const light = theme === 'light'

  return (
    <button
      className="text-muted hover:bg-surface hover:text-fg grid h-[34px] w-[34px] place-items-center rounded-lg"
      onClick={toggle}
      aria-label={light ? '切换深色主题' : '切换浅色主题'}
    >
      <Icon icon={light ? 'ph:sun' : 'ph:moon'} width={18} height={18} aria-hidden="true" />
    </button>
  )
}
