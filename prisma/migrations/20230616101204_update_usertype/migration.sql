-- AlterTable
ALTER TABLE "posted_jobs" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '30 day';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_type" DROP NOT NULL;
