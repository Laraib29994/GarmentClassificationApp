import { FABRIC_OPTIONS, isValidFabric, selectFabric } from "../fabricOptions";

describe("Fabric Selection", () => {
  test("valid fabric selection is stored", () => {
    const selectedFabric = selectFabric(null, "COTTON");

    expect(selectedFabric).toBe("COTTON");
  });

  test("only one fabric can be selected", () => {
    let selectedFabric = selectFabric(null, "COTTON");

    selectedFabric = selectFabric(selectedFabric, "WOOL");

    expect(selectedFabric).toBe("WOOL");
    expect(selectedFabric).not.toBe("COTTON");
  });

  test("changing fabric updates the stored value", () => {
    let selectedFabric = selectFabric(null, "SILK");

    expect(selectedFabric).toBe("SILK");

    selectedFabric = selectFabric(selectedFabric, "LINEN");

    expect(selectedFabric).toBe("LINEN");
  });

  test("supported fabric values are accepted", () => {
    FABRIC_OPTIONS.forEach((fabric) => {
      expect(isValidFabric(fabric)).toBe(true);
    });
  });

  test("unsupported fabric values are rejected", () => {
    expect(isValidFabric("DENIM")).toBe(false);
  });

  test.todo(
    "selected fabric is passed to the analysis function - retest after ML integration",
  );

  test.todo(
    "selected fabric is passed to the recommendation function - retest after recommendation integration",
  );
});
