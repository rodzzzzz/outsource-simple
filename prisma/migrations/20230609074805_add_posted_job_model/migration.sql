/*
  Warnings:

  - You are about to drop the column `published_at` on the `jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "published_at";

-- CreateTable
CREATE TABLE "posted_jobs" (
    "id" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "expiration_date" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL,
    "featured_expiration_date" TIMESTAMP(3),
    "highlighted" BOOLEAN NOT NULL,
    "job_id" TEXT,

    CONSTRAINT "posted_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posted_jobs_job_id_key" ON "posted_jobs"("job_id");
