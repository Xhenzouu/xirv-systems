-- Add columns as nullable first
ALTER TABLE "users" ADD COLUMN "firstName" TEXT;
ALTER TABLE "users" ADD COLUMN "lastName" TEXT;

-- Populate from existing fullName
UPDATE "users" SET 
  "firstName" = SPLIT_PART("fullName", ' ', 1),
  "lastName" = SUBSTRING("fullName" FROM POSITION(' ' IN "fullName") + 1)
WHERE "fullName" IS NOT NULL;

-- Handle users with only one name
UPDATE "users" SET "lastName" = '' WHERE "lastName" IS NULL;

-- Make columns required
ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "lastName" SET NOT NULL;

-- Drop the old column
ALTER TABLE "users" DROP COLUMN "fullName";