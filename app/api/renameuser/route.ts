import { NextResponse, NextRequest } from "next/server";
import { Jimp } from "jimp"; // You'll likely use this later
import jsQR from "jsqr";   // You'll likely use this later
import { prisma } from '@/lib/prisma';
// Removed incorrect 'Session' import from 'inspector/promises'

export async function POST(req: NextRequest) { // <-- FIX: Use NextRequest here
  try {
    const formData = await req.formData();
    const username = formData.get("username") as string;

    if (!username) {
      return NextResponse.json({ error: "No username provided" }, { status: 400 });
    }

    // This will now work correctly
    const sessionCookie = req.cookies.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "No session cookie found" }, { status: 401 });
    }

    // You can get the cookie's value like this:
    const sessionValue = sessionCookie.value;

    const user = await prisma.user.findFirst({ where: { sessions: sessionValue } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's name
    await prisma.user.update({ where: { id: user.id }, data: { name: username } });

    // ... rest of your logic (like QR code decoding) goes here
    
    // Example success response
    return NextResponse.json({ success: true, username });

  } catch (error) {
    console.error("Error in POST /api/decode:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}