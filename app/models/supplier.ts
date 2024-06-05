import { z } from "zod";

import type { HotelData } from "~/types";

/**
 * Abstract class for suppliers. All suppliers should extend this class.
 * Each supplier should implement the following methods:
 * - transformData that defines how they take their output and turn it into a
 * standard hotel data.
 * - url that defines the endpoint to fetch data from.
 * - schema that defines the schema of the data fetched.
 *
 * @abstract
 * @class Supplier
 * @method transformData
 * @method fetchData
 * @method getTransformedData
 */
export abstract class Supplier {
  protected abstract url: string;
  protected abstract schema: z.ZodTypeAny;

  abstract transformData(data: unknown): HotelData[];

  async fetchData() {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return this.schema.parse(data);
  }

  async getTransformedData(): Promise<HotelData[]> {
    const data = await this.fetchData();
    return this.transformData(data);
  }
}
