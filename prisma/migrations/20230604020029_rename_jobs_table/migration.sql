/*
  Warnings:

  - You are about to drop the `job_post_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "job_post_applications";

-- DropTable
DROP TABLE "job_posts";

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "job_description" VARCHAR(500) NOT NULL,
    "category" "JobCategory" NOT NULL,
    "type" "JobType" NOT NULL,
    "skill_set" TEXT[],
    "location_restriction" "JobLocationRestriction" NOT NULL,
    "status" "JobStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,
    "posted_by_id" TEXT NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "JobApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "applicant_id" TEXT NOT NULL,
    "job_post_id" TEXT NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_posted_by_id_idx" ON "jobs"("posted_by_id");

-- CreateIndex
CREATE INDEX "jobs_company_id_idx" ON "jobs"("company_id");

-- CreateIndex
CREATE INDEX "job_applications_job_post_id_idx" ON "job_applications"("job_post_id");

-- CreateIndex
CREATE INDEX "job_applications_applicant_id_idx" ON "job_applications"("applicant_id");
