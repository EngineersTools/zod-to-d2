import { describe, expect, it } from "vitest";
import { getZodMetadata } from "../../src/utils/zodMetadataRegistry";
import { childSchema, parentOneSchema, parentTwoSchema } from "../schema.fixtures";

describe("Foreign Key Tests", () => {
  describe("Metadata", () => {
    it("should have metadata defined for foreign keys", () => {
      expect(getZodMetadata(childSchema._zod.def.shape.parentOneId)).toBeDefined();
      expect(getZodMetadata(childSchema._zod.def.shape.parentTwoId)).toBeDefined();
    });

    it("should have foreignKey metadata", () => {
      expect(getZodMetadata(childSchema._zod.def.shape.parentOneId)?.foreignKey).toBeDefined();
      expect(getZodMetadata(childSchema._zod.def.shape.parentTwoId)?.foreignKey).toBeDefined();
    });

    it("should have correct foreignKey metadata", () => {
      expect(getZodMetadata(childSchema._zod.def.shape.parentOneId)?.foreignKey).toEqual({
        type: 'ZodForeignKey',
        foreignSchema: parentOneSchema,
        foreignProperty: 'id'
      });
      expect(getZodMetadata(childSchema._zod.def.shape.parentTwoId)?.foreignKey).toEqual({
        type: 'ZodForeignKey',
        foreignSchema: parentTwoSchema,
        foreignProperty: 'id'
      });
    });
  });
});


