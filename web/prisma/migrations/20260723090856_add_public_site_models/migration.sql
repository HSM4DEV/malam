-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('CONTACT', 'DEVELOPER_APPLICATION');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "foundedYear" INTEGER;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "preferredDate" TIMESTAMP(3),
ADD COLUMN     "preferredTime" TEXT,
ADD COLUMN     "visitType" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "baths" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "type" "InquiryType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT,
    "subject" TEXT,
    "companyName" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Inquiry_type_createdAt_idx" ON "Inquiry"("type", "createdAt");
