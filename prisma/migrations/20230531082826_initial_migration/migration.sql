-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'SELF_EMPLOYED', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('JUNIOR_HIGHSCHOOL', 'SENIOR_HIGHSCHOOL', 'VOCATIONAL', 'ASSOCIATE_DEGREE', 'BACHELOR_DEGREE', 'MASTERS', 'DOCTORAL', 'PROFESSIONAL_DEGREE', 'JOINT_DEGREE');

-- CreateEnum
CREATE TYPE "JobPostApplicationStatus" AS ENUM ('APPLIED', 'ACCEPTED_FOR_INTERVIEW', 'REJECTED');

-- CreateEnum
CREATE TYPE "JobPostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "JobPostType" AS ENUM ('FULL_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "JobPostCategory" AS ENUM ('SOFTWARE_DEVELOPMENT', 'DESIGN', 'SUPPORT', 'SALES', 'WRITING', 'PRODUCT', 'LEGAL', 'FINANCE', 'MARKETING', 'DATA_ENTRY', 'HEALTHCARE', 'RECRUITMENT', 'TEACHING', 'VIRTUAL_ASSISTANT', 'OTHERS');

-- CreateEnum
CREATE TYPE "JobPostLocationRestriction" AS ENUM ('WORLDWIDE', 'US', 'EUROPE', 'ASIA');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" TIMESTAMP(3),
    "designId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "portfolio_url" TEXT NOT NULL,
    "summary" VARCHAR(500) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3),
    "currentlyWorking" BOOLEAN NOT NULL,
    "details" VARCHAR(500) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_histories" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "level" "EducationLevel" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "details" VARCHAR(500) NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "work_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website_url" TEXT,
    "description" VARCHAR(1000) NOT NULL,
    "admin_email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "job_description" VARCHAR(500) NOT NULL,
    "category" "JobPostCategory" NOT NULL,
    "type" "JobPostType" NOT NULL,
    "location_restriction" "JobPostLocationRestriction" NOT NULL,
    "status" "JobPostStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,
    "posted_by_id" TEXT NOT NULL,

    CONSTRAINT "job_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_post_applications" (
    "id" TEXT NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL,
    "status" "JobPostApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "applicant_id" TEXT NOT NULL,
    "job_post_id" TEXT NOT NULL,

    CONSTRAINT "job_post_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_subscription_id_key" ON "users"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_email_key" ON "resumes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_userId_key" ON "resumes"("userId");

-- CreateIndex
CREATE INDEX "resumes_id_idx" ON "resumes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "educations_resumeId_key" ON "educations"("resumeId");

-- CreateIndex
CREATE INDEX "educations_id_idx" ON "educations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "work_histories_resumeId_key" ON "work_histories"("resumeId");

-- CreateIndex
CREATE INDEX "work_histories_id_idx" ON "work_histories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_userId_key" ON "companies"("userId");

-- CreateIndex
CREATE INDEX "companies_id_idx" ON "companies"("id");

-- CreateIndex
CREATE INDEX "job_posts_posted_by_id_idx" ON "job_posts"("posted_by_id");

-- CreateIndex
CREATE INDEX "job_posts_company_id_idx" ON "job_posts"("company_id");

-- CreateIndex
CREATE INDEX "job_post_applications_job_post_id_idx" ON "job_post_applications"("job_post_id");

-- CreateIndex
CREATE INDEX "job_post_applications_applicant_id_idx" ON "job_post_applications"("applicant_id");
