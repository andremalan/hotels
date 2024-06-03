import { z } from "zod";

import { SupplierOutput } from "../supplierService";

// Define the input schema using Zod
const SupplierSchema = z.object({
  Id: z.string(),
  DestinationId: z.number(),
  Name: z.string(),
  Latitude: z.number().nullable(),
  Longitude: z.number().nullable(),
  Address: z.string(),
  City: z.string(),
  Country: z.string(),
  PostalCode: z.string(),
  Description: z.string(),
  Facilities: z.array(z.string()),
});

const SupplierArraySchema = z.array(SupplierSchema);

interface SupplierService {
  getTransformedData(): Promise<SupplierOutput[]>;
}

export class SupplierOneService implements SupplierService {
  private url = "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme";

  async fetchData() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return SupplierArraySchema.parse(data);
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
      throw error;
    }
  }

  transformData(suppliers: z.infer<typeof SupplierArraySchema>) {
    return suppliers.map((supplier) => ({
      id: supplier.Id,
      destination_id: supplier.DestinationId,
      name: supplier.Name,
      location: {
        lat: supplier.Latitude || 0,
        lng: supplier.Longitude || 0,
        address: `${supplier.Address.trim()}, ${supplier.PostalCode}`,
        city: supplier.City,
        country: supplier.Country === "SG" ? "Singapore" : supplier.Country,
      },
      description: supplier.Description,
      amenities: {
        general: supplier.Facilities.map((facility) =>
          facility.toLowerCase().replace(/\s/g, ""),
        ),
        room: [
          "aircon",
          "tv",
          "coffee machine",
          "kettle",
          "hair dryer",
          "iron",
          "bathtub",
        ],
      },
      images: {
        rooms: [],
        site: [],
        amenities: [],
      },
      booking_conditions: [],
    }));
  }

  async getTransformedData() {
    const suppliers = await this.fetchData();
    return this.transformData(suppliers);
  }
}
