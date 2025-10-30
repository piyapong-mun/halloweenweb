import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
//   const data = await request.json();

  //get Cookies
  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie) {
    return NextResponse.json({ error: 'No session cookie found' }, { status: 401 });
  }

  // Find the user with the provided session token
  const user = await prisma.user.findFirst({ where: { sessions: sessionCookie.value } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json( { status: user.status, score: user.score, card: user.card }, { status: 200 });
}