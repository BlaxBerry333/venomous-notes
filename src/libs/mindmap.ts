/**
 * 思维导图布局——给 react-flow 节点补 position（dagre 自动算）
 * 纯函数，跟 mindmaps.ts（数据访问）解耦
 */

import dagre from 'dagre'
import type { MindmapNode, MindmapEdge } from '@/types'

const DEFAULT_NODE_WIDTH = 200
const DEFAULT_NODE_HEIGHT = 60

export type LayoutDirection = 'LR' | 'TB' | 'RL' | 'BT'

export interface LayoutOptions {
  direction?: LayoutDirection
  nodeWidth?: number
  nodeHeight?: number
  nodesep?: number
  ranksep?: number
}

export type LayoutedNode = MindmapNode & { position: { x: number; y: number } }
export type LayoutedEdge = MindmapEdge & { id: string }

function __layoutGraph(
  nodes: MindmapNode[],
  edges: MindmapEdge[],
  options: LayoutOptions = {},
): { nodes: LayoutedNode[]; edges: LayoutedEdge[] } {
  const {
    direction = 'LR',
    nodeWidth = DEFAULT_NODE_WIDTH,
    nodeHeight = DEFAULT_NODE_HEIGHT,
    nodesep = 32,
    ranksep = 100,
  } = options

  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: direction, nodesep, ranksep })
  g.setDefaultEdgeLabel(() => ({}))

  for (const n of nodes) g.setNode(n.id, { width: nodeWidth, height: nodeHeight })
  for (const e of edges) g.setEdge(e.source, e.target)

  dagre.layout(g)

  const positioned: LayoutedNode[] = nodes.map((n) => {
    const { x, y } = g.node(n.id)
    return {
      ...n,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    }
  })

  const withEdgeIds: LayoutedEdge[] = edges.map((e) => ({
    ...e,
    id: e.id ?? `e-${e.source}-${e.target}`,
  }))

  return { nodes: positioned, edges: withEdgeIds }
}

export const MINDMAP = {
  /** 给 nodes/edges 加 position（dagre 自动布局）+ 合成 edge id */
  layoutGraph: __layoutGraph,
}
