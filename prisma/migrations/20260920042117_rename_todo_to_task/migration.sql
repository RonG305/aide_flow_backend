/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_capture_id_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_user_id_fkey";

-- DropTable
DROP TABLE "Todo";

-- DropEnum
DROP TYPE "TodoPriority";

-- DropEnum
DROP TYPE "TodoStatus";

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "due_date" TIMESTAMP(3),
    "priority" "TaskPriority" NOT NULL DEFAULT 'medium',
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "source" "ActorSource" NOT NULL DEFAULT 'agent',
    "conversation_id" TEXT,
    "capture_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_user_id_status_idx" ON "Task"("user_id", "status");

-- CreateIndex
CREATE INDEX "Task_user_id_due_date_idx" ON "Task"("user_id", "due_date");

-- CreateIndex
CREATE INDEX "Task_conversation_id_idx" ON "Task"("conversation_id");

-- CreateIndex
CREATE INDEX "Task_capture_id_idx" ON "Task"("capture_id");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_capture_id_fkey" FOREIGN KEY ("capture_id") REFERENCES "Capture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
