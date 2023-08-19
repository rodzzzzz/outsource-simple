-- CreateEnum
CREATE TYPE "SalaryCurrency" AS ENUM ('USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'HKD', 'NZD');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "maxSalary" INTEGER,
ADD COLUMN     "salary_currency" "SalaryCurrency" DEFAULT 'USD',
ADD COLUMN     "startingSalary" INTEGER;

-- AlterTable
ALTER TABLE "posted_jobs" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '30 day';
