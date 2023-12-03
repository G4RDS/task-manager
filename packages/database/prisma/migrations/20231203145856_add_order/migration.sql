-- CreateTable
CREATE TABLE "TaskOrder" (
    "taskOrderId" SERIAL NOT NULL,
    "taskId" TEXT NOT NULL,
    "order" TEXT NOT NULL,

    CONSTRAINT "TaskOrder_pkey" PRIMARY KEY ("taskOrderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskOrder_taskId_key" ON "TaskOrder"("taskId");

-- AddForeignKey
ALTER TABLE "TaskOrder" ADD CONSTRAINT "TaskOrder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("taskId") ON DELETE RESTRICT ON UPDATE CASCADE;
