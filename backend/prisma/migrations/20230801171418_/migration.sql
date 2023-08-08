-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT DEFAULT '',
    "user42Name" TEXT,
    "email" TEXT DEFAULT '',
    "coalition" TEXT DEFAULT 'Federation',
    "status" TEXT DEFAULT 'offline',
    "games" INTEGER DEFAULT 0,
    "wins" INTEGER DEFAULT 0,
    "achievements" TEXT[],
    "score" INTEGER DEFAULT 0,
    "accessToken" TEXT NOT NULL DEFAULT 'noToken',
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
