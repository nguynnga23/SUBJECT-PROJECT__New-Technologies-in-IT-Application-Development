-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" TEXT NOT NULL,
    "blockerAccountId" TEXT NOT NULL,
    "blockedAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_blockerAccountId_blockedAccountId_key" ON "BlockedUser"("blockerAccountId", "blockedAccountId");

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockerAccountId_fkey" FOREIGN KEY ("blockerAccountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockedAccountId_fkey" FOREIGN KEY ("blockedAccountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
