import { ACMESupplier } from "~/models/suppliers/acme";
import { PaperfliesSupplier } from "~/models/suppliers/paperflies";
import { PatagoniaSupplier } from "~/models/suppliers/patagonia";
import { mergeHotels } from "~/services/supplier/mergeHotels";
import type { HotelData } from "~/types";

/**
 * Service to fetch, transform and merge data from all suppliers.
 *
 * one idea here might be to assign each one of these a "trust score" and then always choose the
 * value of the most trusted supplier when merging data, but with the current data
 * that seemed to be an over complication.
 */
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

  static async hotels() {
    const hotels = await this.getTransformedData();
    const mergedHotels = mergeHotels(hotels);
    return mergedHotels;
  }
}
