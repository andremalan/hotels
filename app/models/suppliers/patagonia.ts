import { z } from "zod";

import { Supplier } from "~/models/supplier";
import { categorizeAmenities } from "~/services/supplier/categorizeAmenities";
import { formatLocation } from "~/services/supplier/formatLocation";
import type { HotelData } from "~/types";

const SupplierSchema = z.object({
  id: z.string(),
  destination: z.number(),
  name: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  address: z.string().nullable(),
  info: z.string().nullable(),
  amenities: z.array(z.string()).nullable(),
  images: z
    .object({
      rooms: z
        .array(
          z.object({
            url: z.string(),
            description: z.string(),
          }),
        )
        .nullable(),
      amenities: z
        .array(
          z.object({
            url: z.string(),
            description: z.string(),
          }),
        )
        .nullable(),
    })
    .nullable(),
});

const SupplierArraySchema = z.array(SupplierSchema);

export class PatagoniaSupplier extends Supplier {
  protected url =
    "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia";
  protected schema = SupplierArraySchema;

  transformData(suppliers: z.infer<typeof SupplierArraySchema>): HotelData[] {
    return suppliers.map((supplier) => ({
      id: supplier.id,
      destination_id: supplier.destination,
      name: supplier.name,
      location: formatLocation({
        lat: supplier.lat,
        lng: supplier.lng,
        address: supplier.address,
        city: "",
        country: "",
        postalCode: null,
      }),
      description: supplier.info || "",
      amenities: categorizeAmenities(supplier.amenities || []),
      images: {
        rooms:
          supplier.images?.rooms?.map((room) => ({
            link: room.url,
            description: room.description,
          })) || [],
        site: [],
        amenities:
          supplier.images?.amenities?.map((room) => ({
            link: room.url,
            description: room.description,
          })) || [],
      },
      booking_conditions: [],
    }));
  }
}
