-- CreateEnum
CREATE TYPE "CaptureKind" AS ENUM ('audio', 'image', 'document', 'text', 'link');

-- CreateEnum
CREATE TYPE "CaptureStatus" AS ENUM ('pending', 'processing', 'ready', 'failed');

-- CreateEnum
CREATE TYPE "ActorSource" AS ENUM ('user', 'agent');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant', 'system', 'tool');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TodoStatus" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TodoPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capture" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" "CaptureKind" NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'upload',
    "message_id" TEXT,
    "uri" TEXT,
    "mime_type" TEXT,
    "extracted_text" TEXT,
    "metadata" JSONB,
    "status" "CaptureStatus" NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Capture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT,
    "spoken" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "remind_at" TIMESTAMP(3) NOT NULL,
    "recurrence_rule" TEXT,
    "status" "ReminderStatus" NOT NULL DEFAULT 'pending',
    "notified_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "source" "ActorSource" NOT NULL DEFAULT 'agent',
    "message_id" TEXT,
    "capture_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "due_date" TIMESTAMP(3),
    "priority" "TodoPriority" NOT NULL DEFAULT 'medium',
    "status" "TodoStatus" NOT NULL DEFAULT 'pending',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "source" "ActorSource" NOT NULL DEFAULT 'agent',
    "message_id" TEXT,
    "capture_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Capture_user_id_created_at_idx" ON "Capture"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "Capture_user_id_status_idx" ON "Capture"("user_id", "status");

-- CreateIndex
CREATE INDEX "Conversation_user_id_started_at_idx" ON "Conversation"("user_id", "started_at");

-- CreateIndex
CREATE INDEX "Message_conversation_id_created_at_idx" ON "Message"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "Reminder_user_id_status_remind_at_idx" ON "Reminder"("user_id", "status", "remind_at");

-- CreateIndex
CREATE INDEX "Reminder_status_remind_at_idx" ON "Reminder"("status", "remind_at");

-- CreateIndex
CREATE INDEX "Reminder_message_id_idx" ON "Reminder"("message_id");

-- CreateIndex
CREATE INDEX "Reminder_capture_id_idx" ON "Reminder"("capture_id");

-- CreateIndex
CREATE INDEX "Todo_user_id_status_idx" ON "Todo"("user_id", "status");

-- CreateIndex
CREATE INDEX "Todo_user_id_due_date_idx" ON "Todo"("user_id", "due_date");

-- CreateIndex
CREATE INDEX "Todo_message_id_idx" ON "Todo"("message_id");

-- CreateIndex
CREATE INDEX "Todo_capture_id_idx" ON "Todo"("capture_id");

-- AddForeignKey
ALTER TABLE "Capture" ADD CONSTRAINT "Capture_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Capture" ADD CONSTRAINT "Capture_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_capture_id_fkey" FOREIGN KEY ("capture_id") REFERENCES "Capture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_capture_id_fkey" FOREIGN KEY ("capture_id") REFERENCES "Capture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
