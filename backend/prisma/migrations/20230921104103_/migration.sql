-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login42" TEXT,
    "name" TEXT DEFAULT '',
    "email" TEXT DEFAULT '',
    "image" TEXT DEFAULT 'https://res.cloudinary.com/transcendence42/image/upload/v1692378890/ft_transcendence/ft_transcendence_avator_utith7.png',
    "status" TEXT DEFAULT 'offline',
    "games" INTEGER DEFAULT 0,
    "wins" INTEGER DEFAULT 0,
    "winRate" DOUBLE PRECISION,
    "achievements" TEXT[],
    "score" INTEGER DEFAULT 0,
    "rank" INTEGER DEFAULT 0,
    "accessToken" TEXT NOT NULL DEFAULT 'noToken',
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "otp_enabled" BOOLEAN NOT NULL DEFAULT false,
    "otp_verified" BOOLEAN NOT NULL DEFAULT false,
    "otp_validated" BOOLEAN NOT NULL DEFAULT false,
    "otp_code" TEXT DEFAULT '',
    "gamesLost" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gameHistory" INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL,
    "player1" INTEGER NOT NULL,
    "ScorePlayer1" INTEGER NOT NULL,
    "player2" INTEGER NOT NULL,
    "ScorePlayer2" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_pending" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pending_AB_unique" ON "_pending"("A", "B");

-- CreateIndex
CREATE INDEX "_pending_B_index" ON "_pending"("B");

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pending" ADD CONSTRAINT "_pending_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pending" ADD CONSTRAINT "_pending_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;