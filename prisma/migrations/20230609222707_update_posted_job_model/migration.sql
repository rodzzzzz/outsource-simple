/*
  Warnings:

  - You are about to drop the column `status` on the `jobs` table. All the data in the column will be lost.
  - Made the column `published_at` on table `posted_jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expiration_date` on table `posted_jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "posted_jobs" ALTER COLUMN "published_at" SET NOT NULL,
ALTER COLUMN "published_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "expiration_date" SET NOT NULL,
ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '30 day';

-- DropEnum
DROP TYPE "JobStatus";
