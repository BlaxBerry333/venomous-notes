import { Inter, JetBrains_Mono, Fraunces } from 'next/font/google'

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

export const FONTS = {
  CSS_VARIABLES: `${inter.variable} ${mono.variable} ${fraunces.variable}`,
}
