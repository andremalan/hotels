import { z } from "zod";

import { categorizeFacilities } from "./../../utilities/categorizeFacilities";
import { Supplier } from "./../supplier";
import { SupplierOutput } from "./../supplierService";

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

export class ACMESupplier extends Supplier {
  protected url = "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme";
  protected schema = SupplierArraySchema;

  transformData(
    suppliers: z.infer<typeof SupplierArraySchema>,
  ): SupplierOutput[] {
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
      amenities: categorizeFacilities(supplier.Facilities),
      images: {
        rooms: [],
        site: [],
        amenities: [],
      },
      booking_conditions: [],
    }));
  }
}
