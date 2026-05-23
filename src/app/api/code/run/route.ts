import { NextResponse } from 'next/server'

// Mock — Phase 3 will proxy to Piston API with 10s abort timeout
export async function POST(req: Request) {
  const { language, code } = (await req.json()) as { language: string; code: string }
  return NextResponse.json({
    stdout: `[Mock] ${language} execution\n> ${code.slice(0, 60)}\nhello world`,
    stderr: '',
    exitCode: 0,
    duration: 42,
  })
}
