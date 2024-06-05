import { Hotel } from "~/models/hotel.server";
import { ACMESupplier } from "~/models/suppliers/acme";
import { PaperfliesSupplier } from "~/models/suppliers/paperflies";
import { PatagoniaSupplier } from "~/models/suppliers/patagonia";
import { mergeHotels } from "~/services/supplier/mergeHotels";
import type { HotelData } from "~/types";

export class SupplierService {
  static suppliers = [ACMESupplier, PatagoniaSupplier, PaperfliesSupplier];

  static async getTransformedData(): Promise<HotelData[]> {
    const transformedData = await Promise.all(
      this.suppliers.map(async (supplier) => {
        const supplierInstance = new supplier();
        const data = await supplierInstance.fetchData();
        return supplierInstance.transformData(data);
      }),
    );
    return transformedData.flat();
  }
  static async saveHotelsToDatabase(hotels: Record<string, HotelData>) {
    for (const hotelId in hotels) {
      const hotel = hotels[hotelId];
      Hotel.upsert(hotel);
    }
  }

  static async hotels() {
    const hotels = await this.getTransformedData();
    const mergedHotels = mergeHotels(hotels);
    return mergedHotels;
  }
}
