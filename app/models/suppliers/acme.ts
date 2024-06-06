import { z } from "zod";

import { Supplier } from "~/models/supplier";
import { categorizeAmenities } from "~/services/supplier/categorizeAmenities";
import { formatLocation } from "~/services/supplier/formatLocation";
import type { HotelData } from "~/types";

const SupplierSchema = z.object({
  Id: z.string(),
  DestinationId: z.number(),
  Name: z.string(),
  Latitude: z.number().or(z.string()).nullable(),
  Longitude: z.number().or(z.string()).nullable(),
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

  transformData(suppliers: z.infer<typeof SupplierArraySchema>): HotelData[] {
    return suppliers.map((supplier) => ({
      id: supplier.Id,
      destination_id: supplier.DestinationId,
      name: supplier.Name,
      location: formatLocation({
        lat: supplier.Latitude,
        lng: supplier.Longitude,
        address: supplier.Address,
        postalCode: supplier.PostalCode,
        city: supplier.City,
        country: supplier.Country,
      }),
      description: supplier.Description,
      amenities: categorizeAmenities(supplier.Facilities),
      images: {
        rooms: [],
        site: [],
        amenities: [],
      },
      booking_conditions: [],
    }));
  }
}
