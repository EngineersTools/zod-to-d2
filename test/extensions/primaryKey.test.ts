import { describe, expect, it } from "vitest";
import { getZodMetadata } from "../../src/utils/zodMetadataRegistry";
import { childSchema, parentOneSchema, parentTwoSchema, schemaWithoutMetadata } from "../schema.fixtures";

describe("Primary Key Tests", () => {
    describe("Metadata", () => {
        it("should have metadata defined", () => {
            expect(getZodMetadata(parentOneSchema._zod.def.shape.id)).toBeDefined();
            expect(getZodMetadata(parentTwoSchema._zod.def.shape.id)).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.id)).toBeDefined();
        });

        it("should not have metadata for schemas without primaryKey", () => {
            expect(getZodMetadata(schemaWithoutMetadata._zod.def.shape.id)).toBeUndefined();
        });

        it("should have primaryKey metadata", () => {
            expect(getZodMetadata(parentOneSchema._zod.def.shape.id)?.primaryKey).toBeDefined();
            expect(getZodMetadata(parentTwoSchema._zod.def.shape.id)?.primaryKey).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.id)?.primaryKey).toBeDefined();
        });

        it("should have correct primaryKey metadata", () => {
            expect(getZodMetadata(parentOneSchema._zod.def.shape.id)?.primaryKey).toEqual({ type: 'ZodPrimaryKey' });
            expect(getZodMetadata(parentTwoSchema._zod.def.shape.id)?.primaryKey).toEqual({ type: 'ZodPrimaryKey' });
            expect(getZodMetadata(childSchema._zod.def.shape.id)?.primaryKey).toEqual({ type: 'ZodPrimaryKey' });
        });
    });
});