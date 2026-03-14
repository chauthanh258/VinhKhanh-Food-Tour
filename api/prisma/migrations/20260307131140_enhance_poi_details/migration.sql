-- AlterTable
ALTER TABLE "Poi" ADD COLUMN "rating" REAL DEFAULT 0;

-- AlterTable
ALTER TABLE "PoiTranslation" ADD COLUMN "priceRange" TEXT;
ALTER TABLE "PoiTranslation" ADD COLUMN "specialties" TEXT;
