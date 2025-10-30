-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "sessions" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "card" INTEGER[],
    "amount" INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
