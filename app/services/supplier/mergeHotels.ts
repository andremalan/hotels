import { HotelData } from "~/types";

/**
 * Merges hotel data from multiple suppliers.
 *
 * This file has functions for individual rules, functions for specific fields and a main function to merge all data.
 *
 * Some rules that were chosen:
 * 1. Choose the longest description or name. My assumption here is that customers prefer more detail to less detail.
 *    Also, the longer the name and description, the more likely that someone took more care in its creation.
 * 2. Merge amenities and remove any duplicates. Special cases around duplicates like pools that are duplicates, but not exactly the same.
 * 3. Merge images and remove any duplicates.
 * 4. Merge booking conditions and remove any duplicates. Booking conditions could definitely be more complex to merge,
 *    but we don't have any examples of conflicting booking conditions so didn't account for that case.
 * 5. Merge locations by choosing the longest address and the last lat/lng values. Longer means the address is more likely to have more detail.
 * 6. For everything else we just choose the newest value.
 */

function chooseLongest(existing: string, candidate: string): string {
  return candidate.length > existing.length ? candidate : existing;
}

function removeDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

function simpleMerge<T>(existing: T, candidate: T): T {
  return candidate || existing;
}

function mergeLocations(
  existingLocation: HotelData["location"],
  newLocation: HotelData["location"],
): HotelData["location"] {
  return {
    address: chooseLongest(existingLocation.address, newLocation.address),
    city: simpleMerge(existingLocation.city, newLocation.city),
    country: simpleMerge(existingLocation.country, newLocation.country),
    lat: simpleMerge(existingLocation.lat, newLocation.lat),
    lng: simpleMerge(existingLocation.lng, newLocation.lng),
  };
}

function mergeAmenities(
  existingAmenities: HotelData["amenities"],
  newAmenities: HotelData["amenities"],
): HotelData["amenities"] {
  let mergedGeneralAmenities = removeDuplicates([
    ...existingAmenities.general,
    ...newAmenities.general,
  ]);

  // There are lots of types of pools, so if another "pool" and just "pool" is present, remove "pool"
  const poolRegex = /\b\w+\s+pool\b/i;
  if (mergedGeneralAmenities.some((amenity) => poolRegex.test(amenity))) {
    mergedGeneralAmenities = mergedGeneralAmenities.filter(
      (amenity) => amenity !== "pool",
    );
  }

  return {
    general: mergedGeneralAmenities,
    room: removeDuplicates([...existingAmenities.room, ...newAmenities.room]),
  };
}

function mergeImages(
  existingImages: { link: string; description: string }[],
  newImages: { link: string; description: string }[],
): { link: string; description: string }[] {
  const imageMap = new Map(existingImages.map((image) => [image.link, image]));
  newImages.forEach((image) => {
    if (!imageMap.has(image.link)) {
      imageMap.set(image.link, image);
    }
  });
  return Array.from(imageMap.values());
}

export function mergeHotels(hotels: HotelData[]): Record<string, HotelData> {
  const hotelMap: Record<string, HotelData> = {};

  hotels.forEach((hotel) => {
    if (!hotelMap[hotel.id]) {
      hotelMap[hotel.id] = { ...hotel };
    } else {
      const existingHotel = hotelMap[hotel.id];

      existingHotel.description = chooseLongest(
        existingHotel.description,
        hotel.description,
      );
      existingHotel.name = chooseLongest(existingHotel.name, hotel.name);
      existingHotel.location = mergeLocations(
        existingHotel.location,
        hotel.location,
      );
      existingHotel.amenities = mergeAmenities(
        existingHotel.amenities,
        hotel.amenities,
      );
      existingHotel.images.rooms = mergeImages(
        existingHotel.images.rooms,
        hotel.images.rooms,
      );
      existingHotel.images.site = mergeImages(
        existingHotel.images.site,
        hotel.images.site,
      );
      existingHotel.images.amenities = mergeImages(
        existingHotel.images.amenities,
        hotel.images.amenities,
      );
      existingHotel.booking_conditions = removeDuplicates([
        ...existingHotel.booking_conditions,
        ...hotel.booking_conditions,
      ]);
    }
  });

  return hotelMap;
}
