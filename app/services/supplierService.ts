import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { SupplierOutput } from "~/models/supplier";
import { ACMESupplier } from "~/models/suppliers/acme";
import { PaperfliesSupplier } from "~/models/suppliers/paperflies";
import { PatagoniaSupplier } from "~/models/suppliers/patagonia";
import { mergeHotels } from "~/services/supplier/mergeHotels";

export class SupplierService {
  suppliers = [ACMESupplier, PatagoniaSupplier, PaperfliesSupplier];

  async getTransformedData(): Promise<SupplierOutput[]> {
    const transformedData = await Promise.all(
      this.suppliers.map(async (supplier) => {
        const supplierInstance = new supplier();
        const data = await supplierInstance.fetchData();
        return supplierInstance.transformData(data);
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

  async hotels() {
    const hotels = await this.getTransformedData();
    const mergedHotels = mergeHotels(hotels);
    return mergedHotels;
  }
}
