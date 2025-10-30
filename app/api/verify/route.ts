import { NextResponse } from 'next/server';
import {verifyToken} from "@/lib/jwt";




export async function POST(request: Request) {
  const data = await request.json();
  const decoded = verifyToken(data.token);

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}