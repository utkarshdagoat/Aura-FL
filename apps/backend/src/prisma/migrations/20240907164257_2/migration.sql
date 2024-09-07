/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
DROP COLUMN "id",
ALTER COLUMN "bias" SET DEFAULT ARRAY[]::BIGINT[],
ALTER COLUMN "weight" SET DEFAULT ARRAY[]::BIGINT[],
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("address", "taskId");
