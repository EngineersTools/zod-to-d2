import { describe, expect, it } from "vitest";
import { getPrimaryKey } from "../../src/parser/getPrimaryKey";
import {
  childSchema,
  parentOneSchema,
  schemaWithoutMetadata,
} from "../schema.fixtures";

describe("getPrimaryKey Tests", () => {
  it("should return primary key property when defined", () => {
    const primaryKey = getPrimaryKey(parentOneSchema);
    expect(primaryKey).toBeDefined();
    expect(primaryKey?.name).toBe("id");
    expect(primaryKey?.schema).toBeDefined();
  });

  it("should return primary key for child schema", () => {
    const primaryKey = getPrimaryKey(childSchema);
    expect(primaryKey).toBeDefined();
    expect(primaryKey?.name).toBe("id");
    expect(primaryKey?.schema).toBeDefined();
  });

  it("should return undefined when primary key not set", () => {
    const primaryKey = getPrimaryKey(schemaWithoutMetadata);
    expect(primaryKey).toBeUndefined();
  });
});