import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";

import { ACMESupplier } from "./suppliers/acme";
import { PaperfliesSupplier } from "./suppliers/paperflies";
import { PatagoniaSupplier } from "./suppliers/patagonia";

interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}

interface Image {
  link: string;
  description: string;
}

interface Amenities {
  general: string[];
  room: string[];
}

export interface SupplierOutput {
  id: string;
  destination_id: number;
  name: string;
  location: Location;
  description: string;
  amenities: Amenities;
  images: {
    rooms: Image[];
    site: Image[];
    amenities: Image[];
  };
  booking_conditions: string[];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    // you can use classes, interfaces, types, etc.
    type HotelData = SupplierOutput;
  }
}

export class SupplierService {
  suppliers = [ACMESupplier, PatagoniaSupplier, PaperfliesSupplier];

  async getTransformedData(): Promise<SupplierOutput[]> {
    const transformedData = await Promise.all(
      this.suppliers.map(async (supplier) => {
        const service = new supplier();
        const data = await service.fetchData();
        return service.transformData(data);
      }),
    );
    return transformedData.flat();
  }
  async saveHotelsToDatabase(hotels: Record<string, SupplierOutput>) {
    for (const hotelId in hotels) {
      const hotel = hotels[hotelId];
      await prisma.hotel.upsert({
        where: { id: hotel.id },
        update: {
          destinationId: hotel.destination_id,
          name: hotel.name,
          description: hotel.description,
          updatedAt: new Date(),
          data: hotel as unknown as Prisma.JsonObject,
        },
        create: {
          id: hotel.id,
          destinationId: hotel.destination_id,
          name: hotel.name,
          description: hotel.description,
          updatedAt: new Date(),
          createdAt: new Date(),
          data: hotel as unknown as Prisma.JsonObject,
        },
      });
    }
  }
}
