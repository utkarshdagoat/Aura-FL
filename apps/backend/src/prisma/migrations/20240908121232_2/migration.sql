/*
  Warnings:

  - You are about to alter the column `bias` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `weight` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "bias" SET DATA TYPE INTEGER[],
ALTER COLUMN "weight" SET DATA TYPE INTEGER[];
