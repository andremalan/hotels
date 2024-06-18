import { Supplier } from "~/models/supplier";
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
        try {
          const data = await supplierInstance.fetchData();
          return supplierInstance.transformData(data);
        } catch (error) {
          console.error(
            `Error fetching data from supplier: ${supplier.name}`,
            error,
          );
          return [];
        }
      }),
    );
    return transformedData.flat();
  }

  static async hotelsForSupplier(supplierId: string) {
    // need a way to get a supplier by id. Should convert the array above into a map.
    const supplier = this.suppliers.find((s) => s.id === supplierId);
    const supplierInstance = new supplier();
    try {
      const data = await supplierInstance.fetchData();
      return supplierInstance.transformData(data);
    } catch (error) {
      console.error(`Error fetching data from supplier`, error);
    }
  }

  static async hotels() {
    const hotels = await this.getTransformedData();
    const mergedHotels = mergeHotels(hotels);
    return mergedHotels;
  }
}
