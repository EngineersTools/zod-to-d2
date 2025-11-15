import { describe, expect, it } from "vitest";
import { getZodMetadata } from "../../src/utils/zodMetadataRegistry";
import { CHILD_TABLE_NAME, childSchema, PARENT_ONE_TABLE_NAME, PARENT_TWO_TABLE_NAME, parentOneSchema, parentTwoSchema, schemaWithoutMetadata } from "../schema.fixtures";

describe("tableName Tests", () => {
    describe("Metadata", () => {
        it("should have metadata defined", () => {
            expect(getZodMetadata(parentOneSchema)).toBeDefined();
            expect(getZodMetadata(parentTwoSchema)).toBeDefined();
            expect(getZodMetadata(childSchema)).toBeDefined();
        });

        it("should not have metadata for schemas without tableName", () => {
            expect(getZodMetadata(schemaWithoutMetadata)).toBeUndefined();
        });

        it("should have tableName metadata", () => {
            expect(getZodMetadata(parentOneSchema)?.tableName).toBeDefined();
            expect(getZodMetadata(parentTwoSchema)?.tableName).toBeDefined();
            expect(getZodMetadata(childSchema)?.tableName).toBeDefined();
        });

        it("should have correct tableName metadata", () => {
            expect(getZodMetadata(parentOneSchema)?.tableName).toBe(PARENT_ONE_TABLE_NAME);
            expect(getZodMetadata(parentTwoSchema)?.tableName).toBe(PARENT_TWO_TABLE_NAME);
            expect(getZodMetadata(childSchema)?.tableName).toBe(CHILD_TABLE_NAME);
        });
    });
});