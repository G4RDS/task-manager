-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_noteId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("noteId") ON DELETE CASCADE ON UPDATE CASCADE;
