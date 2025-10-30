import { NextResponse } from "next/server";
import {Jimp} from "jimp";
import jsQR from "jsqr";
import { prisma } from '@/lib/prisma';
import { Session } from "inspector/promises";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const x_start = Number(formData.get("x_start") || 0);
    const y_start = Number(formData.get("y_start") || 0);
    const x_end = Number(formData.get("x_end") || 0);
    const y_end = Number(formData.get("y_end") || 0);
    const adjusted = formData.get("adjusted") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const img = await Jimp.read(buffer);

    if (adjusted) {
      const width = Math.max(1, x_end - x_start);
      const height = Math.max(1, y_end - y_start);

      // ✅ New Jimp API uses object for crop
      img.crop({ x: x_start, y: y_start, w: width, h: height })
    }

    const { data, width, height } = img.bitmap;
    const qrCode = jsQR(new Uint8ClampedArray(data), width, height);

    if (qrCode && qrCode.data) {

        // Check if qrCode.data contain '~MEMBERGUILDCARD'
        if (!qrCode.data.includes('~MEMBERGUILDCARD')) {
            return NextResponse.json({ error: "Invalid QR code" }, { status: 400 });
        }

        // qrCode.data split with '~' slect [0]
        // Find user by id 
        const user = await prisma.user.findUnique({
            where: {
                id: qrCode.data.split('~')[0]
            }
        })
        if (user) {
            // random uniquevalue string to generate new session
            const newSession = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            // concat random string to qrCode.data.split('~')[0]
            const combineSession = qrCode.data.split('~')[0] + newSession;

            const token = signToken({combineSession});

            // console.log('user', qrCode.data.split('~')[0]);
            // Update New Session and put to user
            await prisma.user.update({
                where: {
                    id: qrCode.data.split('~')[0]
                },
                data: {
                    sessions: token
                }
            })
            
            // set cookie to user
            let reposne = null
            if (!user.name || user.name === '') {
               reposne = { success: true, data: qrCode.data, username: "ยังไม่ได้ตั้งชื่อ"}
            }
            else {
                reposne = { success: true, data: qrCode.data, username: user.name}
            }
            const res = NextResponse.json(reposne);
            res.cookies.set('session', token, { maxAge: 60 * 60 * 24 * 1 }); // set cookie to 1 day
            
            
            return res
        }else {
            // Add new user
            const newSession = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const combineSession = qrCode.data.split('~')[0] + newSession;

            const token = signToken({combineSession});
            const user = await prisma.user.create({
                data: {
                    id: qrCode.data.split('~')[0],
                    sessions: token,
                    name: "",
                    score: 0,
                    status: 'notfinish',
                    card: []
                }
            })
            const res = NextResponse.json({ success: true, data: qrCode.data, username: "ยังไม่ได้ตั้งชื่อ"});
            res.cookies.set('session', token, { maxAge: 60 * 60 * 24 * 1 }); // set cookie to 1 day
            return res
        }
    //   return NextResponse.json({ success: true, data: qrCode.data });
    } else {
      return NextResponse.json({ success: false, error: "QR code not found" }, { status: 404 });
    }
  } catch (err: any) {
    console.error("Decode error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
