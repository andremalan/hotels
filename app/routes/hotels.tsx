import { json } from "@remix-run/node";

import { SupplierService } from "~/services/supplierService";

export const loader = async () => {
  const supplierService = new SupplierService();
  const hotels = await supplierService.getTransformedData();
  return json(hotels);
};
