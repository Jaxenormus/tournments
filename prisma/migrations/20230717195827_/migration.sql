/*
  Warnings:

  - You are about to drop the column `tierId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the `Tier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `entryFee` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_tierId_fkey";

-- DropForeignKey
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_tournamentId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "tierId";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "entryFee" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Tier";
