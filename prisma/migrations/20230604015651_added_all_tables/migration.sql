/*
  Warnings:

  - You are about to drop the column `userId` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `educations` table. All the data in the column will be lost.
  - You are about to drop the column `currentlyWorking` on the `educations` table. All the data in the column will be lost.
  - You are about to drop the column `employmentType` on the `educations` table. All the data in the column will be lost.
  - You are about to drop the column `fromDate` on the `educations` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `educations` table. All the data in the column will be lost.
  - You are about to drop the column `resumeId` on the `educations` table. All the data in the column will be lost.
  - You are about to drop the column `toDate` on the `educations` table. All the data in the column will be lost.
  - The `status` column on the `job_post_applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userId` on the `resumes` table. All the data in the column will be lost.
  - You are about to drop the column `designId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `fromDate` on the `work_histories` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `work_histories` table. All the data in the column will be lost.
  - You are about to drop the column `resumeId` on the `work_histories` table. All the data in the column will be lost.
  - You are about to drop the column `schoolName` on the `work_histories` table. All the data in the column will be lost.
  - You are about to drop the column `toDate` on the `work_histories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resume_id]` on the table `educations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `resumes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resume_id]` on the table `work_histories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_date` to the `educations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `educations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume_id` to the `educations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_name` to the `educations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_date` to the `educations` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `job_posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `job_posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `location_restriction` on the `job_posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `job_posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `resumes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `work_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currently_working` to the `work_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employment_type` to the `work_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_date` to the `work_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_title` to the `work_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume_id` to the `work_histories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('APPLICANT', 'EMPLOYER');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('MICRO', 'SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('APPLIED', 'ACCEPTED_FOR_INTERVIEW', 'REJECTED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('SOFTWARE_DEVELOPMENT', 'DESIGN', 'SUPPORT', 'SALES', 'WRITING', 'PRODUCT', 'LEGAL', 'FINANCE', 'MARKETING', 'DATA_ENTRY', 'HEALTHCARE', 'RECRUITMENT', 'TEACHING', 'VIRTUAL_ASSISTANT', 'OTHERS');

-- CreateEnum
CREATE TYPE "JobLocationRestriction" AS ENUM ('WORLDWIDE', 'US', 'EUROPE', 'ASIA');

-- DropIndex
DROP INDEX "companies_userId_key";

-- DropIndex
DROP INDEX "educations_resumeId_key";

-- DropIndex
DROP INDEX "resumes_userId_key";

-- DropIndex
DROP INDEX "work_histories_resumeId_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "userId",
ADD COLUMN     "company_size" "CompanySize",
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "year_founded" TEXT;

-- AlterTable
ALTER TABLE "educations" DROP COLUMN "company",
DROP COLUMN "currentlyWorking",
DROP COLUMN "employmentType",
DROP COLUMN "fromDate",
DROP COLUMN "jobTitle",
DROP COLUMN "resumeId",
DROP COLUMN "toDate",
ADD COLUMN     "from_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "level" "EducationLevel" NOT NULL,
ADD COLUMN     "resume_id" TEXT NOT NULL,
ADD COLUMN     "school_name" TEXT NOT NULL,
ADD COLUMN     "to_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "job_post_applications" ALTER COLUMN "applied_at" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "JobApplicationStatus" NOT NULL DEFAULT 'APPLIED';

-- AlterTable
ALTER TABLE "job_posts" ADD COLUMN     "skill_set" TEXT[],
DROP COLUMN "category",
ADD COLUMN     "category" "JobCategory" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "JobType" NOT NULL,
DROP COLUMN "location_restriction",
ADD COLUMN     "location_restriction" "JobLocationRestriction" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "JobStatus" NOT NULL;

-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "userId",
ADD COLUMN     "skill_set" TEXT[],
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "portfolio_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "designId",
ADD COLUMN     "user_type" "UserType" NOT NULL;

-- AlterTable
ALTER TABLE "work_histories" DROP COLUMN "fromDate",
DROP COLUMN "level",
DROP COLUMN "resumeId",
DROP COLUMN "schoolName",
DROP COLUMN "toDate",
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "currently_working" BOOLEAN NOT NULL,
ADD COLUMN     "employment_type" "EmploymentType" NOT NULL,
ADD COLUMN     "from_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "job_title" TEXT NOT NULL,
ADD COLUMN     "resume_id" TEXT NOT NULL,
ADD COLUMN     "skill_set" TEXT[],
ADD COLUMN     "to_date" TIMESTAMP(3);

-- DropEnum
DROP TYPE "JobPostApplicationStatus";

-- DropEnum
DROP TYPE "JobPostCategory";

-- DropEnum
DROP TYPE "JobPostLocationRestriction";

-- DropEnum
DROP TYPE "JobPostStatus";

-- DropEnum
DROP TYPE "JobPostType";

-- CreateTable
CREATE TABLE "saved_jobs" (
    "id" TEXT NOT NULL,
    "saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "job_post_id" TEXT NOT NULL,

    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saved_jobs_job_post_id_idx" ON "saved_jobs"("job_post_id");

-- CreateIndex
CREATE INDEX "saved_jobs_user_id_idx" ON "saved_jobs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_user_id_key" ON "companies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "educations_resume_id_key" ON "educations"("resume_id");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_user_id_key" ON "resumes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_histories_resume_id_key" ON "work_histories"("resume_id");
