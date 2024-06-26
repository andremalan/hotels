-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hotel_id_idx" ON "Hotel"("id");

-- CreateIndex
CREATE INDEX "Hotel_destinationId_idx" ON "Hotel"("destinationId");
