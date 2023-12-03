/*
  Warnings:

  - You are about to drop the `TaskOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskOrder" DROP CONSTRAINT "TaskOrder_taskId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "order" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "TaskOrder";
