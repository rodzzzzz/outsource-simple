-- DropIndex
DROP INDEX "companies_id_idx";

-- DropIndex
DROP INDEX "resumes_id_idx";

-- CreateIndex
CREATE INDEX "companies_id_user_id_idx" ON "companies"("id", "user_id");

-- CreateIndex
CREATE INDEX "resumes_id_user_id_idx" ON "resumes"("id", "user_id");
