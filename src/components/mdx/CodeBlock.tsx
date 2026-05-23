interface Props {
  children: React.ReactNode
  'data-language'?: string
  [key: string]: unknown
}

/* 代码块 —— 语言标签浮于右上 padding 区（无复制功能） */
export function CodeBlock({ children, 'data-language': lang, ...rest }: Props) {
  return (
    <div className="code-block">
      {lang && (
        <div className="code-block-bar">
          <span className="code-lang">{lang}</span>
        </div>
      )}
      <pre {...(rest as React.HTMLAttributes<HTMLPreElement>)}>{children}</pre>
    </div>
  )
}
