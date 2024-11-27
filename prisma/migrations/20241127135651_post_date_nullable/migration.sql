-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "date" SET DEFAULT (now() at time zone 'utc');

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "date_published" DROP NOT NULL,
ALTER COLUMN "date_published" DROP DEFAULT;
