/*
  Warnings:

  - You are about to drop the column `message_id` on the `Capture` table. All the data in the column will be lost.
  - You are about to drop the column `ended_at` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `started_at` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Capture" DROP CONSTRAINT "Capture_message_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_message_id_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_message_id_fkey";

-- DropIndex
DROP INDEX "Conversation_user_id_started_at_idx";

-- DropIndex
DROP INDEX "Reminder_message_id_idx";

-- DropIndex
DROP INDEX "Todo_message_id_idx";

-- AlterTable
ALTER TABLE "Capture" DROP COLUMN "message_id",
ADD COLUMN     "conversation_id" TEXT;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "ended_at",
DROP COLUMN "started_at",
ADD COLUMN     "messages" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "message_id",
ADD COLUMN     "conversation_id" TEXT;

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "message_id",
ADD COLUMN     "conversation_id" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_hash",
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "Message";

-- DropEnum
DROP TYPE "MessageRole";

-- CreateIndex
CREATE INDEX "Conversation_user_id_created_at_idx" ON "Conversation"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "Reminder_conversation_id_idx" ON "Reminder"("conversation_id");

-- CreateIndex
CREATE INDEX "Todo_conversation_id_idx" ON "Todo"("conversation_id");

-- AddForeignKey
ALTER TABLE "Capture" ADD CONSTRAINT "Capture_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
