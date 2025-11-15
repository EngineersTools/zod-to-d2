import { describe, expect, it } from "vitest";
import { getTableName } from "../../src/parser/getTableName";
import { getZodMetadata } from "../../src/utils/zodMetadataRegistry";
import { childSchema, CHILD_TABLE_NAME, parentOneSchema, PARENT_ONE_TABLE_NAME, schemaWithoutMetadata } from "../schema.fixtures";

describe("getTableName Tests", () => {

  it("should return table name when defined", () => {
    expect(getZodMetadata(parentOneSchema)).toBeDefined();
    const tableName = getTableName(parentOneSchema);
    expect(tableName).toBe(PARENT_ONE_TABLE_NAME);
  });

  it("should return table name for child schema", () => {
    expect(getZodMetadata(childSchema)).toBeDefined();
    const tableName = getTableName(childSchema);
    expect(tableName).toBe(CHILD_TABLE_NAME);
  });

  it("should return undefined when table name not set", () => {
    const tableName = getTableName(schemaWithoutMetadata);
    expect(tableName).toBeUndefined();
  });
});