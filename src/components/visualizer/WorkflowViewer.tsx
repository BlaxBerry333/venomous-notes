'use client'

// Phase 3: replace with dynamic ReactFlow + 4 custom node types
export function WorkflowViewer({ title }: { title?: string }) {
  return (
    <div
      style={{
        height: '500px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <div style={{ fontSize: '32px', opacity: 0.1 }}>⬦</div>
      <div style={{ fontSize: '13px', color: 'var(--muted2)' }}>ReactFlow WorkflowViewer</div>
      {title && (
        <div style={{ fontSize: '12px', color: 'var(--muted2)', opacity: 0.5 }}>{title}</div>
      )}
      <div style={{ fontSize: '11px', color: 'var(--muted2)', opacity: 0.35 }}>Phase 3</div>
    </div>
  )
}
