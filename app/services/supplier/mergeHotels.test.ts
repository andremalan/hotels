import { SupplierOutput } from "~/models/supplier";

import { mergeHotels } from "./mergeHotels";

describe("mergeHotels", () => {
  it("should merge hotels correctly", () => {
    const hotels: SupplierOutput[] = [
      {
        id: "1",
        destination_id: 123,
        name: "Hotel A",
        location: {
          lat: 1.0,
          lng: 1.0,
          address: "Address A",
          city: "City A",
          country: "Country A",
        },
        description: "Short description",
        amenities: {
          general: ["pool", "wifi"],
          room: ["air conditioner", "television"],
        },
        images: {
          rooms: [{ link: "room1.jpg", description: "Room 1" }],
          site: [{ link: "site1.jpg", description: "Site 1" }],
          amenities: [],
        },
        booking_conditions: ["Condition A"],
      },
      {
        id: "1",
        destination_id: 123,
        name: "Hotel A",
        location: {
          lat: 1.0,
          lng: 1.0,
          address: "Address A",
          city: "City A",
          country: "Country A",
        },
        description: "This is a longer description for Hotel A.",
        amenities: {
          general: ["parking"],
          room: ["kettle"],
        },
        images: {
          rooms: [{ link: "room2.jpg", description: "Room 2" }],
          site: [],
          amenities: [{ link: "amenity1.jpg", description: "Amenity 1" }],
        },
        booking_conditions: ["Condition B"],
      },
    ];

    const result = mergeHotels(hotels);

    expect(result).toEqual({
      "1": {
        id: "1",
        destination_id: 123,
        name: "Hotel A",
        location: {
          lat: 1.0,
          lng: 1.0,
          address: "Address A",
          city: "City A",
          country: "Country A",
        },
        description: "This is a longer description for Hotel A.",
        amenities: {
          general: ["pool", "wifi", "parking"],
          room: ["air conditioner", "television", "kettle"],
        },
        images: {
          rooms: [
            { link: "room1.jpg", description: "Room 1" },
            { link: "room2.jpg", description: "Room 2" },
          ],
          site: [{ link: "site1.jpg", description: "Site 1" }],
          amenities: [{ link: "amenity1.jpg", description: "Amenity 1" }],
        },
        booking_conditions: ["Condition A", "Condition B"],
      },
    });
  });

  it("should handle hotels with no duplicates", () => {
    const hotels: SupplierOutput[] = [
      {
        id: "1",
        destination_id: 123,
        name: "Hotel A",
        location: {
          lat: 1.0,
          lng: 1.0,
          address: "Address A",
          city: "City A",
          country: "Country A",
        },
        description: "Description for Hotel A",
        amenities: {
          general: ["pool"],
          room: ["air conditioner"],
        },
        images: {
          rooms: [{ link: "room1.jpg", description: "Room 1" }],
          site: [],
          amenities: [],
        },
        booking_conditions: ["Condition A"],
      },
      {
        id: "2",
        destination_id: 456,
        name: "Hotel B",
        location: {
          lat: 2.0,
          lng: 2.0,
          address: "Address B",
          city: "City B",
          country: "Country B",
        },
        description: "Description for Hotel B",
        amenities: {
          general: ["wifi"],
          room: ["television"],
        },
        images: {
          rooms: [{ link: "room2.jpg", description: "Room 2" }],
          site: [],
          amenities: [],
        },
        booking_conditions: ["Condition B"],
      },
    ];

    const result = mergeHotels(hotels);

    expect(result).toEqual({
      "1": {
        id: "1",
        destination_id: 123,
        name: "Hotel A",
        location: {
          lat: 1.0,
          lng: 1.0,
          address: "Address A",
          city: "City A",
          country: "Country A",
        },
        description: "Description for Hotel A",
        amenities: {
          general: ["pool"],
          room: ["air conditioner"],
        },
        images: {
          rooms: [{ link: "room1.jpg", description: "Room 1" }],
          site: [],
          amenities: [],
        },
        booking_conditions: ["Condition A"],
      },
      "2": {
        id: "2",
        destination_id: 456,
        name: "Hotel B",
        location: {
          lat: 2.0,
          lng: 2.0,
          address: "Address B",
          city: "City B",
          country: "Country B",
        },
        description: "Description for Hotel B",
        amenities: {
          general: ["wifi"],
          room: ["television"],
        },
        images: {
          rooms: [{ link: "room2.jpg", description: "Room 2" }],
          site: [],
          amenities: [],
        },
        booking_conditions: ["Condition B"],
      },
    });
  });
});
