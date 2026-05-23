// Phase 3: replace with dynamic Mermaid + Web Worker rendering
export function MermaidChart({ children }: { children?: string }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '24px',
        margin: '1rem 0',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--muted2)',
          marginBottom: '12px',
        }}
      >
        Mermaid Chart — Phase 3
      </div>
      <pre
        style={{
          fontSize: '12px',
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono)',
          textAlign: 'left',
          overflow: 'auto',
        }}
      >
        {children}
      </pre>
    </div>
  )
}
