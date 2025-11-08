import { describe, it, expect } from "vitest";

const expectedExports = [
  "createArrayPropertyType",
  "createEnumPropertyType",
  "createLiteralPropertyType",
  "createObjectPropertyType",
  "createPrimitivePropertyType",
  "createRecordPropertyType",
  "createUnionPropertyType",
  "createUnknownPropertyType",
  "getForeignKeyFromMeta",
  "getObjectProperties",
  "hasNotes",
  "isForeignKey",
  "isPrimaryKey",
  "parseProperties",
  "parseRelationships",
];

describe("Integration: compiled package exports", () => {
  it("should export parser functions from dist/index.js", async () => {
    const mod = await import("../../dist/index.js");
    const anyMod = mod as any;
    // ensure all expected names are exported
    expect(Object.keys(anyMod)).toEqual(expect.arrayContaining(expectedExports));

    // and each expected export is defined
    for (const name of expectedExports) {
      expect(anyMod[name]).toBeDefined();
    }
  });
});
