/*
  Warnings:

  - You are about to drop the column `bussinessId` on the `payments` table. All the data in the column will be lost.
  - Added the required column `businessId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "bussinessId",
ADD COLUMN     "businessId" INTEGER NOT NULL,
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP;
