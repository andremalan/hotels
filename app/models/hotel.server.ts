import { prisma } from "~/db.server";
import { SupplierService } from "~/services/supplierService";
import { mergeHotels } from "~/utilities/mergeHotels";

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

  static async refreshData() {
    const supplierService = new SupplierService();
    const hotels = await supplierService.getTransformedData();
    const mergedHotels = mergeHotels(hotels);
    await supplierService.saveHotelsToDatabase(mergedHotels);
    return mergedHotels;
  }
}
