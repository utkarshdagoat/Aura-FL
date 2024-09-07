/*
  Warnings:

  - You are about to drop the column `kernel` on the `Client` table. All the data in the column will be lost.
  - The `weight` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "kernel",
ADD COLUMN     "bias" BIGINT[],
DROP COLUMN "weight",
ADD COLUMN     "weight" BIGINT[];
