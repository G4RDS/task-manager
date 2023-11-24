/*
  Warnings:

  - Made the column `noteId` on table `Note` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taskId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/

-- Copy id value to noteId
UPDATE "Note" SET "noteId" = "id";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "noteId" SET NOT NULL;

-- Copy id value to taskId
UPDATE "Task" SET "taskId" = "id";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "taskId" SET NOT NULL;
