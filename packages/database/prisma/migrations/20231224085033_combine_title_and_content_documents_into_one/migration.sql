/*
  Warnings:

  - You are about to drop the column `contentBlobUrl` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `titleBlobUrl` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "contentBlobUrl",
DROP COLUMN "titleBlobUrl",
ADD COLUMN     "documentUrl" TEXT;
