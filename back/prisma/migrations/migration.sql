-- CreateTable
CREATE TABLE "users" (
	"id" SERIAL NOT NULL,
	"id42" INTEGER NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	"email" TEXT NOT NULL,
	"username" TEXT,
	"avatar" TEXT,
	"hashed" TEXT,
	-- "hash" TEXT NOT NULL,
	-- "twoFAsecret" TEXT,
	-- "twoFA" BOOLEAN DEFAULT false,
	"gamesWon" INTEGER NOT NULL DEFAULT 0,
	"gamesLost" INTEGER NOT NULL DEFAULT 0,
	"gamesPlayed" INTEGER NOT NULL DEFAULT 0,
	"gameHistory" INTEGER[],
	-- "winRate" DOUBLE PRECISION,
	-- "playTime" INTEGER NOT NULL DEFAULT 0,
	-- "score" INTEGER NOT NULL DEFAULT 1200,
	-- "rank" INTEGER,
	-- "friends" INTEGER[],
	-- "adding" INTEGER[],
	-- "added" INTEGER[],
	-- "blocks" INTEGER[],
	-- "blocking" INTEGER[],
	-- "blocked" INTEGER[],

	CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
	"id" INTEGER NOT NULL,
	"player1" INTEGER NOT NULL,
	"player2" INTEGER NOT NULL,
	"score1" INTEGER NOT NULL,
	"score2" INTEGER NOT NULL,
	"startTime" TIMESTAMP(3) NOT NULL,
	"endTime" TIMESTAMP(3) NOT NULL,
	"duration" INTEGER,

	CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
