/*
  Warnings:

  - You are about to drop the column `capture_id` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `conversation_id` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `capture_id` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `conversation_id` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Capture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Capture" DROP CONSTRAINT "Capture_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Capture" DROP CONSTRAINT "Capture_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_capture_id_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_capture_id_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_conversation_id_fkey";

-- DropIndex
DROP INDEX "Reminder_capture_id_idx";

-- DropIndex
DROP INDEX "Reminder_conversation_id_idx";

-- DropIndex
DROP INDEX "Task_capture_id_idx";

-- DropIndex
DROP INDEX "Task_conversation_id_idx";

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "capture_id",
DROP COLUMN "conversation_id";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "capture_id",
DROP COLUMN "conversation_id";

-- DropTable
DROP TABLE "Capture";

-- DropTable
DROP TABLE "Conversation";

-- DropEnum
DROP TYPE "CaptureKind";

-- DropEnum
DROP TYPE "CaptureStatus";
