import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { HotelData } from "~/types";

export class Hotel {
  static async byId(id: string) {
    const result = await prisma.hotel.findUnique({
      where: { id },
    });
    return result?.data;
  }

  static async byIds(ids: string[]) {
    const result = await prisma.hotel.findMany({
      where: { id: { in: ids } },
    });
    return result.map((hotel) => hotel.data);
  }

  static async byDestination(destinationId: number) {
    const result = await prisma.hotel.findMany({
      where: { destinationId },
    });
    return result.map((hotel) => hotel.data);
  }

  static async all() {
    const result = await prisma.hotel.findMany();
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
}
