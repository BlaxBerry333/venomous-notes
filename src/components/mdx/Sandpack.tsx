// Phase 3: replace with dynamic @codesandbox/sandpack-react
export function Sandpack({ template }: { template?: string }) {
  return (
    <div
      style={{
        height: '320px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        color: 'var(--muted2)',
        margin: '1rem 0',
      }}
    >
      Sandpack ({template ?? 'react'}) — Phase 3
    </div>
  )
}
