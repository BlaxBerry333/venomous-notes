'use client'

// Phase 4: 320px collapsible panel with Chat + toolbar tabs
export function AiPanel() {
  return (
    <aside
      style={{
        width: '320px',
        flexShrink: 0,
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        color: 'var(--muted2)',
      }}
    >
      AI Panel — Phase 4
    </aside>
  )
}
