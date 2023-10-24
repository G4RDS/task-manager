/*
  Warnings:

  - You are about to drop the column `content` on the `Note` table. All the data in the column will be lost.
  - Added the required column `contentBlob` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleBlob` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "content",
ADD COLUMN     "contentBlob" BYTEA NOT NULL,
ADD COLUMN     "titleBlob" BYTEA NOT NULL;
