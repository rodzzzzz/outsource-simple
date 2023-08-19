/*
  Warnings:

  - The values [JPY,CHF,HKD,NZD] on the enum `SalaryCurrency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SalaryCurrency_new" AS ENUM ('USD', 'EUR', 'GBP', 'AUD', 'CAD');
ALTER TABLE "jobs" ALTER COLUMN "salary_currency" DROP DEFAULT;
ALTER TABLE "jobs" ALTER COLUMN "salary_currency" TYPE "SalaryCurrency_new" USING ("salary_currency"::text::"SalaryCurrency_new");
ALTER TYPE "SalaryCurrency" RENAME TO "SalaryCurrency_old";
ALTER TYPE "SalaryCurrency_new" RENAME TO "SalaryCurrency";
DROP TYPE "SalaryCurrency_old";
ALTER TABLE "jobs" ALTER COLUMN "salary_currency" SET DEFAULT 'USD';
COMMIT;

-- AlterTable
ALTER TABLE "posted_jobs" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '30 day';
