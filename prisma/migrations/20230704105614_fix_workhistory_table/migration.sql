/*
  Warnings:

  - Added the required column `field_of_study` to the `educations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "educations" ADD COLUMN     "field_of_study" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posted_jobs" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '30 day',
ALTER COLUMN "featured" SET DEFAULT false,
ALTER COLUMN "highlighted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "work_histories" ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "details" DROP NOT NULL,
ALTER COLUMN "employment_type" DROP NOT NULL,
ALTER COLUMN "from_date" DROP NOT NULL;
