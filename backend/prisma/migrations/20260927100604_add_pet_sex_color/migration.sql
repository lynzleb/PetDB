-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "color" TEXT,
ADD COLUMN     "sex" "Sex";
