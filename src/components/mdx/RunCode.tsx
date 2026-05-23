// Phase 3: JS/TS/React/Vue → Sandpack; others → /api/code/run (Piston)
export function RunCode({ lang, code }: { lang?: string; code?: string }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px dashed var(--border2)',
        borderRadius: '6px',
        padding: '12px 16px',
        margin: '8px 0',
        fontSize: '12px',
        color: 'var(--muted2)',
      }}
    >
      RunCode ({lang ?? 'unknown'}) — Phase 3
    </div>
  )
}
