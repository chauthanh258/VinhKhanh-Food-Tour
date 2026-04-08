-- AlterTable
ALTER TABLE "poi_translations"
ADD COLUMN IF NOT EXISTS "audio_public_id" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "image_public_id" VARCHAR(255);
