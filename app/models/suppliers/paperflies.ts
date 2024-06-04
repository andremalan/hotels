import { z } from "zod";

import { Supplier, SupplierOutput } from "~/models/supplier";
import { normalizeFacility } from "~/services/supplier/categorizeFacilities";

const SupplierSchema = z.object({
  hotel_id: z.string(),
  destination_id: z.number(),
  hotel_name: z.string(),
  location: z.object({
    address: z.string(),
    country: z.string(),
  }),
  details: z.string(),
  amenities: z.object({
    general: z.array(z.string()),
    room: z.array(z.string()),
  }),
  images: z.object({
    rooms: z.array(
      z.object({
        link: z.string(),
        caption: z.string(),
      }),
    ),
    site: z.array(
      z.object({
        link: z.string(),
        caption: z.string(),
      }),
    ),
  }),
  booking_conditions: z.array(z.string()),
});

const SupplierArraySchema = z.array(SupplierSchema);

export class PaperfliesSupplier extends Supplier {
  protected url =
    "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies";
  protected schema = SupplierArraySchema;
  transformData(
    suppliers: z.infer<typeof SupplierArraySchema>,
  ): SupplierOutput[] {
    return suppliers.map((supplier) => ({
      id: supplier.hotel_id,
      destination_id: supplier.destination_id,
      name: supplier.hotel_name,
      location: {
        lat: 0, // Placeholder value as latitude is not provided
        lng: 0, // Placeholder value as longitude is not provided
        address: supplier.location.address,
        city: "", // Placeholder value as city is not provided
        country: supplier.location.country,
      },
      description: supplier.details,
      amenities: {
        general: supplier.amenities.general.map((amenity) =>
          normalizeFacility(amenity),
        ),
        room: supplier.amenities.room.map((amenity) =>
          normalizeFacility(amenity),
        ),
      },
      images: {
        rooms: supplier.images.rooms.map((image) => ({
          link: image.link,
          description: image.caption,
        })),
        site: supplier.images.site.map((image) => ({
          link: image.link,
          description: image.caption,
        })),
        amenities: [], // Ensure amenities is always present
      },
      booking_conditions: supplier.booking_conditions,
    }));
  }
}
