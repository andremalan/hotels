import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { mergeHotels } from "~/services/supplier/mergeHotels";
import { HotelData } from "~/types";

export class Hotel {
  static async LoadHotelsFromSupplierData() {
    //query for all supplier data
    // merge all records with same hotel id.
    // save to db.
    await this.saveHotels(hotels);
  }

  static async byId(id: string) {
    const result = await prisma.hotel.findUnique({
      where: { id },
    });
    return result?.data;
  }

  static async byIds(ids: string[]) {
    const result = await prisma.hotel.findMany({
      where: { id: { in: ids } },
      orderBy: {
        id: "asc",
      },
    });
    return result.map((hotel) => hotel.data);
  }

  static async byDestination(destinationId: number) {
    const result = await prisma.hotel.findMany({
      where: { destinationId },
      orderBy: {
        id: "asc",
      },
    });
    return result.map((hotel) => hotel.data);
  }

  static async all() {
    const result = await prisma.hotel.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return result.map((hotel) => hotel.data);
  }

  static async upsert(hotel: HotelData) {
    await prisma.hotel.upsert({
      where: { id: hotel.id },
      update: {
        destinationId: hotel.destination_id,
        name: hotel.name,
        description: hotel.description,
        updatedAt: new Date(),
        // unforuntate typing hack due to poor Prisma support for JSON types.
        data: hotel as unknown as Prisma.JsonObject,
      },
      create: {
        id: hotel.id,
        destinationId: hotel.destination_id,
        name: hotel.name,
        description: hotel.description,
        updatedAt: new Date(),
        createdAt: new Date(),
        // unforuntate typing hack due to poor Prisma support for JSON types.
        data: hotel as unknown as Prisma.JsonObject,
      },
    });
  }

  static async saveHotels(hotels: Record<string, HotelData>) {
    // Prisma doesn't have a bulk upsert method, so we have to do this one by one.
    for (const hotelId in hotels) {
      const hotel = hotels[hotelId];
      await this.upsert(hotel);
    }
  }

  // this probably belongs in a new model for SupplierHotel
  static async saveHotelsForSupplier(supplier: string, hotels: HotelData[]) {
    for (const hotelId in hotels) {
      const hotel = hotels[hotelId];
      // first find hotel by id
      // Upsert method would move to the supplierHotel model and upsert those.
      // would also want upsert to create a "modified" data field so we can track when the data was last updated.
      // and only perform a merge on updated data.
      await this.upsert(hotel);
    }
  }
}
