import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/mdx/Callout'

// Used when @next/mdx is integrated (Phase 4). next-mdx-remote passes components directly.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, Callout }
}
