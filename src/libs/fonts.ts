import { Inter, JetBrains_Mono, Fraunces, Caveat } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

// 手绘风 mindmap 用 —— 仅英文走 Caveat；中文字符按 fallback 链走系统手写体
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

export const FONTS = {
  CSS_VARIABLES: `${inter.variable} ${mono.variable} ${fraunces.variable} ${caveat.variable}`,
}
