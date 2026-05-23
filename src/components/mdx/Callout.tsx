const ICONS = {
  info: 'ℹ',
  warning: '⚠',
  danger: '✕',
  tip: '✓',
} as const

interface Props {
  type?: keyof typeof ICONS
  children: React.ReactNode
}

const BOX = {
  info: 'bg-[rgba(59,130,246,0.07)] border-[rgba(59,130,246,0.25)]',
  warning: 'bg-[rgba(245,158,11,0.07)] border-[rgba(245,158,11,0.25)]',
  danger: 'bg-[rgba(239,68,68,0.07)] border-[rgba(239,68,68,0.25)]',
  tip: 'bg-[rgba(52,211,153,0.07)] border-[rgba(52,211,153,0.25)]',
} as const

const ICON_COLOR = {
  info: 'text-[#60a5fa]',
  warning: 'text-[#fbbf24]',
  danger: 'text-[#f87171]',
  tip: 'text-[#34d399]',
} as const

export function Callout({ type = 'info', children }: Props) {
  return (
    <div className={`my-6 flex gap-2.5 rounded-lg border border-solid px-4 py-3 ${BOX[type]}`}>
      <span className={`mt-0.5 flex-shrink-0 text-[13px] ${ICON_COLOR[type]}`}>{ICONS[type]}</span>
      <div className="text-fg2 text-[14px] leading-[1.65]">{children}</div>
    </div>
  )
}
