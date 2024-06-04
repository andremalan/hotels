import { z } from "zod";

interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}

interface Image {
  link: string;
  description: string;
}

interface Amenities {
  general: string[];
  room: string[];
}

export interface SupplierOutput {
  id: string;
  destination_id: number;
  name: string;
  location: Location;
  description: string;
  amenities: Amenities;
  images: {
    rooms: Image[];
    site: Image[];
    amenities: Image[];
  };
  booking_conditions: string[];
}

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

  abstract transformData(data: unknown): SupplierOutput[];

  async fetchData() {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return this.schema.parse(data);
  }

  async getTransformedData(): Promise<SupplierOutput[]> {
    const data = await this.fetchData();
    return this.transformData(data);
  }
}
