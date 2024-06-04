// SupplierService.test.ts

import { http, HttpResponse } from "msw";
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";

import { server } from "../../../mocks/server";

import { ACMESupplier } from "./acme";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SupplierService", () => {
  it("should fetch and transform data correctly", async () => {
    // Mock successful response
    server.use(
      http.get(
        "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme",
        async () => {
          return HttpResponse.json([
            {
              Id: "iJhz",
              DestinationId: 5432,
              Name: "Beach Villas Singapore",
              Latitude: 1.264751,
              Longitude: 103.824006,
              Address: "8 Sentosa Gateway, Beach Villas",
              City: "Singapore",
              Country: "SG",
              PostalCode: "098269",
              Description:
                "Surrounded by tropical gardens, these upscale villas in elegant Colonial-style buildings are part of the Resorts World Sentosa complex and a 2-minute walk from the Waterfront train station. Featuring sundecks and pool, garden or sea views, the plush 1- to 3-bedroom villas offer free Wi-Fi and flat-screens, as well as free-standing baths, minibars, and tea and coffeemaking facilities. Upgraded villas add private pools, fridges and microwaves; some have wine cellars. A 4-bedroom unit offers a kitchen and a living room. There's 24-hour room and butler service. Amenities include posh restaurant, plus an outdoor pool, a hot tub, and free parking.",
              Facilities: [
                "Pool",
                "BusinessCenter",
                "WiFi",
                "DryCleaning",
                "aircon",
                "Breakfast",
              ],
            },
          ]);
        },
      ),
    );

    const service = new ACMESupplier();
    const result = await service.getTransformedData();

    expect(result).toEqual([
      {
        id: "iJhz",
        destination_id: 5432,
        name: "Beach Villas Singapore",
        location: {
          lat: 1.264751,
          lng: 103.824006,
          address: "8 Sentosa Gateway, Beach Villas, 098269",
          city: "Singapore",
          country: "Singapore",
        },
        description:
          "Surrounded by tropical gardens, these upscale villas in elegant Colonial-style buildings are part of the Resorts World Sentosa complex and a 2-minute walk from the Waterfront train station. Featuring sundecks and pool, garden or sea views, the plush 1- to 3-bedroom villas offer free Wi-Fi and flat-screens, as well as free-standing baths, minibars, and tea and coffeemaking facilities. Upgraded villas add private pools, fridges and microwaves; some have wine cellars. A 4-bedroom unit offers a kitchen and a living room. There's 24-hour room and butler service. Amenities include posh restaurant, plus an outdoor pool, a hot tub, and free parking.",
        amenities: {
          general: [
            "pool",
            "business center",
            "wifi",
            "dry cleaner",
            "breakfast",
          ],
          room: ["air conditioner"],
        },
        images: {
          rooms: [],
          site: [],
          amenities: [],
        },
        booking_conditions: [],
      },
    ]);
  });

  it("should raise an error if the data does not match the schema", async () => {
    // Mock response with invalid data
    server.use(
      http.get(
        "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme",
        async () => {
          return HttpResponse.json([
            {
              // Missing required fields to trigger validation error
              DestinationId: 5432,
              Name: "Beach Villas Singapore",
            },
          ]);
        },
      ),
    );

    const service = new ACMESupplier();

    await expect(service.getTransformedData()).rejects.toThrowError();
  });
});
