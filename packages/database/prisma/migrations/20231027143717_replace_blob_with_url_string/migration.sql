/*
  Warnings:

  - You are about to drop the column `contentBlob` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `titleBlob` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "contentBlob",
DROP COLUMN "titleBlob",
ADD COLUMN     "contentBlobUrl" TEXT,
ADD COLUMN     "titleBlobUrl" TEXT;
