-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "commissionRatePercent" DOUBLE PRECISION NOT NULL DEFAULT 2.5;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "dealValueMillions" DOUBLE PRECISION;
