import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey"; // ใช้ .env จริงใน production

// ✅ สร้าง token
export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" }); // หมดอายุใน 7 วัน
}

// ✅ ตรวจสอบ token
export function verifyToken(token: string) {
  try {
    console.log("Verify token:", SECRET);
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.log("Verify token error:", err);
    return null;
  }
}