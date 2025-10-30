import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

console.log("DATABASE_URL =", process.env.DATABASE_URL);

execSync("npx prisma migrate dev --name init", { stdio: "inherit" });