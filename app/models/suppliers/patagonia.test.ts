import { http, HttpResponse } from "msw";
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";

import { server } from "~/../mocks/server";

import { PatagoniaSupplier } from "./patagonia";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SupplierPatagoniaService", () => {
  it("should fetch and transform data correctly", async () => {
    server.use(
      http.get(
        "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia",
        async () => {
          return HttpResponse.json([
            {
              id: "iJhz",
              destination: 5432,
              name: "Beach Villas Singapore",
              lat: 1.264751,
              lng: 103.824006,
              address: "8 Sentosa Gateway, Beach Villas, 098269",
              info: "Located at the western tip of Resorts World Sentosa...",
              amenities: [
                "Aircon",
                "Tv",
                "Coffee machine",
                "Kettle",
                "Hair dryer",
                "Iron",
                "Tub",
              ],
              images: {
                rooms: [
                  {
                    url: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/2.jpg",
                    description: "Double room",
                  },
                  {
                    url: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/4.jpg",
                    description: "Bathroom",
                  },
                ],
                amenities: [
                  {
                    url: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/0.jpg",
                    description: "RWS",
                  },
                  {
                    url: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/6.jpg",
                    description: "Sentosa Gateway",
                  },
                ],
              },
            },
          ]);
        },
      ),
    );

    const service = new PatagoniaSupplier();
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
          city: "",
          country: "",
        },
        description: "Located at the western tip of Resorts World Sentosa...",
        amenities: {
          general: [],
          room: [
            "air conditioner",
            "television",
            "coffee machine",
            "kettle",
            "hair dryer",
            "iron",
            "bathtub",
          ],
        },
        images: {
          rooms: [
            {
              link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/2.jpg",
              description: "Double room",
            },
            {
              link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/4.jpg",
              description: "Bathroom",
            },
          ],
          site: [],
          amenities: [
            {
              link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/0.jpg",
              description: "RWS",
            },
            {
              link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/6.jpg",
              description: "Sentosa Gateway",
            },
          ],
        },
        booking_conditions: [],
      },
    ]);
  });

  it("should raise an error if the data does not match the schema", async () => {
    server.use(
      http.get(
        "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia",
        async () => {
          return HttpResponse.json([
            {
              destination: 5432,
              name: "Beach Villas Singapore",
            },
          ]);
        },
      ),
    );

    const service = new PatagoniaSupplier();

    await expect(service.getTransformedData()).rejects.toThrowError();
  });
});
