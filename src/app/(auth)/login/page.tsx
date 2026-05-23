import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <div className="bg-bg flex min-h-screen items-center justify-center">
      <div className="bg-surface2 border-border w-[340px] rounded-xl border px-10 py-12 text-center">
        <div className="text-accent mb-1.5 text-[22px] font-extrabold tracking-[-0.03em]">
          venomous notes
        </div>
        <p className="text-muted mb-8 text-[13px]">Personal knowledge base</p>
        <Link
          href="/"
          className="bg-accent flex items-center justify-center gap-2.5 rounded-[7px] px-5 py-2.5 text-[14px] font-medium text-white"
        >
          Continue with GitHub
        </Link>
        <p className="text-muted2 mt-5 text-[11px]">OAuth coming in Phase 4</p>
      </div>
    </div>
  )
}
