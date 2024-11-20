-- CreateTable
CREATE TABLE "RoomType" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "roomTypeId" INTEGER NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "bedCount" INTEGER NOT NULL,
    "oceanView" BOOLEAN NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "guestName" TEXT NOT NULL,
    "checkInDate" DATE NOT NULL,
    "checkOutDate" DATE NOT NULL,
    "guests" INTEGER NOT NULL,
    "breakfast" BOOLEAN NOT NULL DEFAULT false,
    "baseCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weekendsCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "breakfastCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountByDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
