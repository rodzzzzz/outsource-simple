/*
  Warnings:

  - The `job_description` column on the `jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "job_description",
ADD COLUMN     "job_description" JSONB;
