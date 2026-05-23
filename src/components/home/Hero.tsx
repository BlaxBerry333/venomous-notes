'use client'

import { Fragment } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Icon } from '@iconify/react'

/* Hero · design-spec §4.1 —— 进场堆叠 stagger 0.08s；移动端独占视口 + 滚动提示 */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export interface Stat {
  label: string
  value: string
}

function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="mt-[40px] flex items-center gap-[28px] max-md:mt-[34px] max-md:gap-[16px]">
      {stats.map((s, i) => (
        <Fragment key={s.label}>
          {i > 0 && (
            <span
              className="bg-border2 h-[34px] w-px transition duration-[250ms] max-md:h-[30px]"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col gap-[6px]">
            <span className="text-accent font-mono text-[26px] font-medium tracking-[-0.02em] max-md:text-[22px]">
              {s.value}
            </span>
            <span className="text-muted text-[11.5px] font-semibold tracking-[0.1em] uppercase">
              {s.label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export function Hero({ stats }: { stats: Stat[] }) {
  const reduced = useReducedMotion()

  const blocks = [
    <p className="text-accent text-[12px] font-semibold tracking-[0.14em] uppercase" key="eyebrow">
      Personal Knowledge Base
    </p>,
    <h1
      className="font-display text-fg my-[20px] mb-[22px] text-[60px] leading-[1.05] font-[480] tracking-[-0.02em] max-md:my-[16px] max-md:mb-[18px] max-md:text-[36px]"
      key="headline"
    >
      Venomous Notes
    </h1>,
    <p
      className="text-fg2 max-w-[480px] text-[16.5px] leading-[1.7] max-md:text-[15px]"
      key="subhead"
    >
      笔记、思维导图与流程文档，集中沉淀。
    </p>,
    <StatRow stats={stats} key="stats" />,
  ]

  return (
    <section className="relative flex flex-1 flex-col justify-center pt-[50px] pb-[64px] transition duration-[250ms] max-md:min-h-[calc(100svh-var(--topbar-h))] max-md:pt-[32px] max-md:pb-[76px]">
      <div className="relative max-w-[600px]">
        {reduced ? (
          blocks
        ) : (
          <motion.div variants={container} initial="hidden" animate="show">
            {blocks.map((b, i) => (
              <motion.div variants={item} key={i}>
                {b}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div
        className="text-muted2 pointer-events-none absolute right-0 bottom-[22px] left-0 hidden justify-center max-md:flex"
        aria-hidden="true"
      >
        <Icon
          icon="ph:caret-down"
          width={22}
          height={22}
          className="animate-[hero-bob_1.9s_ease-in-out_infinite]"
        />
      </div>
    </section>
  )
}
