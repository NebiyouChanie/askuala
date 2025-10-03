import { NextRequest, NextResponse } from "next/server"
import { verifySession } from "./session"
 
// lib/api-auth.ts
export function protectApiRoute(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      await verifySession()
      return await handler(req)
    } catch (error) {
      console.log("~ return ~ error:", error)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
}