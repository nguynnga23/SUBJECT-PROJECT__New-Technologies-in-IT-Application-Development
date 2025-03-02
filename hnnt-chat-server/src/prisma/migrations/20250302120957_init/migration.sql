/*
  Warnings:

  - You are about to drop the column `status` on the `FriendRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "status";

-- DropEnum
DROP TYPE "RequestStatus";
