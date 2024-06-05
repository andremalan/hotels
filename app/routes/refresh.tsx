import { json } from "@remix-run/node";

import { SupplierService } from "~/services/supplierService";

export const loader = async () => {
  const hotels = await SupplierService.hotels();
  await SupplierService.saveHotelsToDatabase(hotels);
  return json(hotels);
};
