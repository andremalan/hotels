import { restore, stub } from "sinon";
import { it, expect } from "vitest";

import { ACMESupplier } from "~/models/suppliers/acme";
import { PaperfliesSupplier } from "~/models/suppliers/paperflies";
import { PatagoniaSupplier } from "~/models/suppliers/patagonia";
import { SupplierService } from "~/services/supplierService";
// This test isn't working properly, copilot failed me.
describe("group", () => {
  afterEach(() => {
    // Restore all stubs after each test
    restore();
  });
  it("SupplierService fetches, transforms, and merges data correctly", async () => {
    // Stub the fetchData and transformData methods of the suppliers
    const stubs = [
      stub(ACMESupplier.prototype, "fetchData").returns(
        Promise.resolve([
          { id: "1", name: "Test Hotel", stars: 5, city: "Test City" },
        ]),
      ),
      stub(PatagoniaSupplier.prototype, "fetchData").returns(
        Promise.resolve([
          { id: "2", name: "Test Hotel 2", stars: 4, city: "Test City 2" },
        ]),
      ),
      stub(PaperfliesSupplier.prototype, "fetchData").returns(
        Promise.resolve([
          { id: "3", name: "Test Hotel 3", stars: 3, city: "Test City 3" },
        ]),
      ),
    ];

    const hotels = await SupplierService.hotels();

    // Check if the hotels data is as expected
    expect(hotels).toEqual([
      { id: "1", name: "Test Hotel", stars: 5, city: "Test City" },
      { id: "2", name: "Test Hotel 2", stars: 4, city: "Test City 2" },
      { id: "3", name: "Test Hotel 3", stars: 3, city: "Test City 3" },
    ]);

    // Restore the stubs
    stubs.forEach((stub) => stub.restore());
  });

  it("SupplierService handles supplier error", async () => {
    // Stub one of the suppliers to throw an error
    stub(ACMESupplier.prototype, "fetchData").throws(new Error("Test error"));

    try {
      await SupplierService.hotels();
    } catch (error) {
      const err = error as Error;
      expect(err.message).toBe("Test error");
    }
  });
});
