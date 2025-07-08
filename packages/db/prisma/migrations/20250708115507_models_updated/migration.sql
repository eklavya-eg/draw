/*
  Warnings:

  - Made the column `pin` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "pin" SET NOT NULL,
ALTER COLUMN "pin" SET DEFAULT '',
ALTER COLUMN "public" DROP DEFAULT;
