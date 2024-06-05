import { HotelData } from "~/types";

export function mergeHotels(hotels: HotelData[]): Record<string, HotelData> {
  const hotelMap: Record<string, HotelData> = {};

  hotels.forEach((hotel) => {
    if (hotelMap[hotel.id]) {
      // Hotel already exists, merge fields
      const existingHotel = hotelMap[hotel.id];

      // Merge descriptions (keep the longest one)
      if (hotel.description.length > existingHotel.description.length) {
        existingHotel.description = hotel.description;
      }

      // Merge locations (keep any existing fields and add any missing fields)

      existingHotel.location.address =
        hotel.location.address || existingHotel.location.address;
      existingHotel.location.city =
        hotel.location.city || existingHotel.location.city;
      existingHotel.location.country =
        hotel.location.country || existingHotel.location.country;
      existingHotel.location.lat =
        hotel.location.lat || existingHotel.location.lat;
      existingHotel.location.lng =
        hotel.location.lng || existingHotel.location.lng;

      // Merge amenities (remove duplicates)
      existingHotel.amenities.general = Array.from(
        new Set([
          ...existingHotel.amenities.general,
          ...hotel.amenities.general,
        ]),
      );
      existingHotel.amenities.room = Array.from(
        new Set([...existingHotel.amenities.room, ...hotel.amenities.room]),
      );

      // Merge images (rooms, site, amenities) - remove duplicates by link
      const mergeImages = (
        existingImages: { link: string; description: string }[],
        newImages: { link: string; description: string }[],
      ) => {
        const imageMap = new Map(
          existingImages.map((image) => [image.link, image]),
        );
        newImages.forEach((image) => {
          if (!imageMap.has(image.link)) {
            imageMap.set(image.link, image);
          }
        });
        return Array.from(imageMap.values());
      };

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

      // Merge booking conditions (remove duplicates)
      existingHotel.booking_conditions = Array.from(
        new Set([
          ...existingHotel.booking_conditions,
          ...hotel.booking_conditions,
        ]),
      );
    } else {
      // Hotel does not exist, add it to the map
      hotelMap[hotel.id] = { ...hotel };
    }
  });

  return hotelMap;
}
