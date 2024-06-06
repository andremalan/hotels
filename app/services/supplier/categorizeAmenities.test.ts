import { describe, it, expect } from "vitest";

import { normalizeAmenity, categorizeAmenities } from "./categorizeAmenities";

describe("normalizeFacility", () => {
  it("should normalize facility names correctly", () => {
    const facilities = [
      " Aircon ",
      "TV",
      "CoffeeMachine",
      "HairDryer",
      "DryCleaning",
      "DryCleaner",
      "wi fi",
      "bath tub",
      "BusinessCenter",
    ];

    const expected = [
      "air conditioner",
      "television",
      "coffee machine",
      "hair dryer",
      "dry cleaning",
      "dry cleaning",
      "wifi",
      "bathtub",
      "business center",
    ];

    facilities.forEach((facility, index) => {
      expect(normalizeAmenity(facility)).toEqual(expected[index]);
    });
  });
});

describe("categorizeAmenities", () => {
  it("should categorize and normalize facilities correctly", () => {
    const facilities = [
      "Aircon",
      "TV",
      "CoffeeMachine",
      "Kettle",
      "HairDryer",
      "Iron",
      "Tub",
      "Pool",
      "BusinessCenter",
      "WiFi",
      "DryCleaning",
      "DryCleaner",
      "Breakfast",
      "Parking",
      "Childcare",
      "Bar",
      "Concierge",
    ];

    const result = categorizeAmenities(facilities);

    expect(result).toEqual({
      general: [
        "pool",
        "business center",
        "wifi",
        "dry cleaning",
        "dry cleaning",
        "breakfast",
        "parking",
        "childcare",
        "bar",
        "concierge",
      ],
      room: [
        "air conditioner",
        "television",
        "coffee machine",
        "kettle",
        "hair dryer",
        "iron",
        "bathtub",
      ],
    });
  });

  it("should categorize new facilities as general", () => {
    const facilities = ["Spa", "Gym", "Lounge"];

    const result = categorizeAmenities(facilities);

    expect(result).toEqual({
      general: ["spa", "gym", "lounge"],
      room: [],
    });
  });

  it("should handle mixed case facilities and camelCase facilities", () => {
    const facilities = [
      "DryCleaner",
      "DryCleaning",
      "dry cleaner",
      "someThing",
    ];

    const result = categorizeAmenities(facilities);

    expect(result).toEqual({
      general: ["dry cleaning", "dry cleaning", "dry cleaning", "some thing"],
      room: [],
    });
  });

  it("should strip whitespace from facility names", () => {
    const facilities = [
      " Aircon ",
      " TV ",
      "CoffeeMachine  ",
      " HairDryer",
      " DryCleaning ",
    ];

    const result = categorizeAmenities(facilities);

    expect(result).toEqual({
      general: ["dry cleaning"],
      room: ["air conditioner", "television", "coffee machine", "hair dryer"],
    });
  });
});
