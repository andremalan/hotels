import { describe, it, expect } from "vitest";

import type { HotelData } from "~/types";

import { mergeHotels } from "./mergeHotels";

const hotelData: HotelData[] = [
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
      room: ["air conditioner", "television", "coffee machine"],
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
    name: "Hotel A with a longer name",
    location: {
      lat: 1.0,
      lng: 1.0,
      address: "Longer Address A",
      city: "City A",
      country: "Country A",
    },
    description: "This is a much longer description for Hotel A.",
    amenities: {
      general: ["parking", "outside pool", "wifi"],
      room: ["kettle"],
    },
    images: {
      rooms: [
        { link: "room2.jpg", description: "Room 2" },
        { link: "room1.jpg", description: "Room 1 Duplicate" },
      ],
      site: [],
      amenities: [{ link: "amenity1.jpg", description: "Amenity 1" }],
    },
    booking_conditions: ["Condition B"],
  },
  {
    id: "1",
    destination_id: 123,
    name: "Hotel A with a much longer name that should be kept",
    location: {
      lat: 1.1,
      lng: 1.1,
      address: "Short Adrs A",
      city: "City A",
      country: "Country A",
    },
    description:
      "This is the longest description for Hotel A that should be kept because it provides the most details.",
    amenities: {
      general: ["gym"],
      room: ["coffee machine"],
    },
    images: {
      rooms: [{ link: "room3.jpg", description: "Room 3" }],
      site: [],
      amenities: [{ link: "amenity2.jpg", description: "Amenity 2" }],
    },
    booking_conditions: ["Condition C"],
  },
];

describe("mergeHotels", () => {
  it("should merge duplicate hotels correctly", () => {
    const result = mergeHotels(hotelData);

    expect(result).toEqual({
      "1": {
        id: "1",
        destination_id: 123,
        name: "Hotel A with a much longer name that should be kept",
        location: {
          lat: 1.1,
          lng: 1.1,
          address: "Longer Address A",
          city: "City A",
          country: "Country A",
        },
        description:
          "This is the longest description for Hotel A that should be kept because it provides the most details.",
        amenities: {
          general: ["wifi", "parking", "outside pool", "gym"],
          room: ["air conditioner", "television", "coffee machine", "kettle"],
        },
        images: {
          rooms: [
            { link: "room1.jpg", description: "Room 1" },
            { link: "room2.jpg", description: "Room 2" },
            { link: "room3.jpg", description: "Room 3" },
          ],
          site: [{ link: "site1.jpg", description: "Site 1" }],
          amenities: [
            { link: "amenity1.jpg", description: "Amenity 1" },
            { link: "amenity2.jpg", description: "Amenity 2" },
          ],
        },
        booking_conditions: ["Condition A", "Condition B", "Condition C"],
      },
    });
  });

  it("should keep the longest description", () => {
    const result = mergeHotels(hotelData);
    expect(result["1"].description).toBe(
      "This is the longest description for Hotel A that should be kept because it provides the most details.",
    );
  });

  it("should keep the longest name", () => {
    const result = mergeHotels(hotelData);
    expect(result["1"].name).toBe(
      "Hotel A with a much longer name that should be kept",
    );
  });

  it("should merge locations correctly", () => {
    const result = mergeHotels(hotelData);
    expect(result["1"].location).toEqual({
      lat: 1.1,
      lng: 1.1,
      address: "Longer Address A",
      city: "City A",
      country: "Country A",
    });
  });

  it("should merge and de-duplicate amenities correctly", () => {
    const result = mergeHotels(hotelData);
    expect(result["1"].amenities).toEqual({
      general: ["wifi", "parking", "outside pool", "gym"],
      room: ["air conditioner", "television", "coffee machine", "kettle"],
    });
  });

  it("should merge and de-duplicate images correctly", () => {
    const result = mergeHotels(hotelData);
    expect(result["1"].images).toEqual({
      rooms: [
        { link: "room1.jpg", description: "Room 1" },
        { link: "room2.jpg", description: "Room 2" },
        { link: "room3.jpg", description: "Room 3" },
      ],
      site: [{ link: "site1.jpg", description: "Site 1" }],
      amenities: [
        { link: "amenity1.jpg", description: "Amenity 1" },
        { link: "amenity2.jpg", description: "Amenity 2" },
      ],
    });
  });

  it("should merge and de-duplicate booking conditions correctly", () => {
    const result = mergeHotels(hotelData);
    expect(result["1"].booking_conditions).toEqual([
      "Condition A",
      "Condition B",
      "Condition C",
    ]);
  });
});
