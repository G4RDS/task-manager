/*
  Warnings:

  - You are about to drop the column `contentBlobUrl` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `contentHtml` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `titleBlobUrl` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "contentBlobUrl",
DROP COLUMN "contentHtml",
DROP COLUMN "titleBlobUrl";
