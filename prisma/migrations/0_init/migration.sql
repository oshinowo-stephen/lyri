-- CreateTable
CREATE TABLE "GuildPlayer" (
    "djRole" TEXT,
    "adminRole" TEXT,
    "guildId" TEXT NOT NULL,
    "leaveOnEmpty" BOOLEAN NOT NULL DEFAULT false,
    "leaveOnEmptyDuration" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "GuildPlayer_pkey" PRIMARY KEY ("guildId")
);

