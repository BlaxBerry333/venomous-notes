import { NextResponse } from 'next/server'

// Mock — Phase 4 will use generateObject(CheckResult schema) with Claude
export async function POST() {
  return NextResponse.json({
    score: 85,
    issues: [{ type: 'suggestion', message: 'Phase 4 将启用真实文档检查', line: 1 }],
    summary: 'Mock check result — Phase 4 will use generateObject with Claude',
  })
}
