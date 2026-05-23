import type { Metadata } from 'next'
import { FONTS } from '@/libs/fonts'
import { SITE_META } from '@/libs/site'

import './globals.css'

export const metadata: Metadata = {
  title: { default: SITE_META.NAME, template: `%s · ${SITE_META.NAME}` },
  description: SITE_META.DESCRIPTION,
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.svg',
  },
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={FONTS.CSS_VARIABLES}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('vn-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
