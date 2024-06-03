import { z } from "zod";

import { fetchData } from "./../utilities/fetchSupplier";
import { SupplierOutput } from "./supplierService";

export abstract class Supplier {
  protected abstract url: string;
  protected abstract schema: z.ZodTypeAny;

  abstract transformData(data: unknown): SupplierOutput[];

  async fetchData() {
    return await fetchData(this.url, this.schema);
  }

  async getTransformedData(): Promise<SupplierOutput[]> {
    const data = await this.fetchData();
    return this.transformData(data);
  }
}
