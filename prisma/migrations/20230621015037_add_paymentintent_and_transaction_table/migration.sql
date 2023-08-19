/*
  Warnings:

  - You are about to drop the column `stripe_current_period_end` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_price_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SUCCESS', 'FAILED', 'PROCESSING');

-- DropIndex
DROP INDEX "users_stripe_subscription_id_key";

-- AlterTable
ALTER TABLE "posted_jobs" ALTER COLUMN "expiration_date" SET DEFAULT NOW() + interval '30 day';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_current_period_end",
DROP COLUMN "stripe_price_id",
DROP COLUMN "stripe_subscription_id";

-- CreateTable
CREATE TABLE "payment_intents" (
    "id" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "job_id" TEXT,

    CONSTRAINT "payment_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "user_id" TEXT NOT NULL,
    "job_id" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_job_id_key" ON "payment_intents"("job_id");

-- CreateIndex
CREATE INDEX "payment_intents_job_id_idx" ON "payment_intents"("job_id");

-- CreateIndex
CREATE INDEX "payment_intents_user_id_idx" ON "payment_intents"("user_id");

-- CreateIndex
CREATE INDEX "transactions_job_id_idx" ON "transactions"("job_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");
