import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const data = await request.json();

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

  //Update the user
  const updatedUser = await prisma.user.update({ where: { id: user.id }, data: { status: data.status, score: data.score, card: data.card } });
  if (!updatedUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}