import type { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createTRPCContext(req: NextRequest, res: NextResponse) {
  // const session = await getServerSession();
  const session = { user: { id: 1, name: "test" } };

  return { session };
}
