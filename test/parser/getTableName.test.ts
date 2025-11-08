import { describe, expect, it } from "vitest";
import { getTableName } from "../../src/parser/getTableName";
import { childSchema, CHILD_TABLE_NAME, parentOneSchema, PARENT_ONE_TABLE_NAME, schemaWithoutMetadata } from "../schema.fixtures";

describe("getTableName Tests", () => {
  it("should return table name when defined", () => {
    expect(parentOneSchema._zod.def.shape.id.meta()).toBeDefined();
    const tableName = getTableName(parentOneSchema);
    expect(tableName).toBe(PARENT_ONE_TABLE_NAME);
  });

  it("should return table name for child schema", () => {
    expect(childSchema._zod.def.shape.id.meta()).toBeDefined();
    const tableName = getTableName(childSchema);
    expect(tableName).toBe(CHILD_TABLE_NAME);
  });

  it("should return undefined when table name not set", () => {
    const tableName = getTableName(schemaWithoutMetadata);
    expect(tableName).toBeUndefined();
  });
});