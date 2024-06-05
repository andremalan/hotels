import { http, HttpResponse } from "msw";
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";

import { server } from "../../../mocks/server";

import { PaperfliesSupplier } from "./paperflies";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SupplierPaperfliesService", () => {
  it("should fetch and transform data correctly", async () => {
    server.use(
      http.get(
        "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies",
        async () => {
          return HttpResponse.json([
            {
              hotel_id: "iJhz",
              destination_id: 5432,
              hotel_name: "Beach Villas Singapore",
              location: {
                address: "8 Sentosa Gateway, Beach Villas, 098269",
                country: "Singapore",
              },
              details:
                "Surrounded by tropical gardens, these upscale villas in elegant Colonial-style buildings are part of the Resorts World Sentosa complex...",
              amenities: {
                general: [
                  "outdoor pool",
                  "indoor pool",
                  "business center",
                  "childcare",
                ],
                room: ["tv", "coffee machine", "kettle", "hair dryer", "iron"],
              },
              images: {
                rooms: [
                  {
                    link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/2.jpg",
                    caption: "Double room",
                  },
                  {
                    link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/3.jpg",
                    caption: "Double room",
                  },
                ],
                site: [
                  {
                    link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/1.jpg",
                    caption: "Front",
                  },
                ],
              },
              booking_conditions: [
                "All children are welcome...",
                "Pets are not allowed.",
                "WiFi is available in all areas and is free of charge.",
                "Free private parking is possible on site...",
              ],
            },
          ]);
        },
      ),
    );

    const service = new PaperfliesSupplier();
    const result = await service.getTransformedData();

    expect(result).toEqual([
      {
        id: "iJhz",
        destination_id: 5432,
        name: "Beach Villas Singapore",
        location: {
          lat: null,
          lng: null,
          address: "8 Sentosa Gateway, Beach Villas, 098269",
          city: "",
          country: "Singapore",
        },
        description:
          "Surrounded by tropical gardens, these upscale villas in elegant Colonial-style buildings are part of the Resorts World Sentosa complex...",
        amenities: {
          general: [
            "outdoor pool",
            "indoor pool",
            "business center",
            "childcare",
          ],
          room: [
            "television",
            "coffee machine",
            "kettle",
            "hair dryer",
            "iron",
          ],
        },
        images: {
          rooms: [
            {
              link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/2.jpg",
              description: "Double room",
            },
            {
              link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/3.jpg",
              description: "Double room",
            },
          ],
          site: [
            {
              link: "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/1.jpg",
              description: "Front",
            },
          ],
          amenities: [],
        },
        booking_conditions: [
          "All children are welcome...",
          "Pets are not allowed.",
          "WiFi is available in all areas and is free of charge.",
          "Free private parking is possible on site...",
        ],
      },
    ]);
  });

  it("should raise an error if the data does not match the schema", async () => {
    server.use(
      http.get(
        "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies",
        async () => {
          return HttpResponse.json([
            {
              destination_id: 5432,
              hotel_name: "Beach Villas Singapore",
            },
          ]);
        },
      ),
    );

    const service = new PaperfliesSupplier();

    await expect(service.getTransformedData()).rejects.toThrowError();
  });
});
