/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive', 'suspended', 'deleted');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "accept_terms_conditions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "date_of_birth" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';
