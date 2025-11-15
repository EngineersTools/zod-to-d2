import { describe, expect, it } from "vitest";
import { getZodMetadata } from "../../src/utils/zodMetadataRegistry";
import { CHILD_ARRAY_PROPERTY_NOTES, CHILD_NUMBER_PROPERTY_NOTES, CHILD_PARENT_NAME_WITH_NOTES_COMMENTS, CHILD_PARENT_ONE_ID_COMMENT, CHILD_PARENT_TWO_ID_COMMENT, childSchema, schemaWithoutMetadata } from "../schema.fixtures";

describe("Notes Tests", () => {
    describe("Metadata", () => {
        it("should have metadata defined", () => {
            expect(getZodMetadata(childSchema._zod.def.shape.parentOneId)).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.parentTwoId)).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.parentNameWithNotes)).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.numberProperty)).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.arrayProperty.element)).toBeDefined();
        });

        it("should not have metadata for schemas without notes", () => {
            expect(getZodMetadata(schemaWithoutMetadata._zod.def.shape.id)).toBeUndefined();
        });

        it("should have notes metadata", () => {
            expect(getZodMetadata(childSchema._zod.def.shape.parentOneId)?.notes).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.parentTwoId)?.notes).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.parentNameWithNotes)?.notes).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.numberProperty)?.notes).toBeDefined();
            expect(getZodMetadata(childSchema._zod.def.shape.arrayProperty.element)?.notes).toBeDefined();
        });

        it("should have correct notes metadata", () => {
            expect(getZodMetadata(childSchema._zod.def.shape.parentOneId)?.notes).toEqual([CHILD_PARENT_ONE_ID_COMMENT]);
            expect(getZodMetadata(childSchema._zod.def.shape.parentTwoId)?.notes).toEqual([CHILD_PARENT_TWO_ID_COMMENT]);
            expect(getZodMetadata(childSchema._zod.def.shape.parentNameWithNotes)?.notes).toEqual(CHILD_PARENT_NAME_WITH_NOTES_COMMENTS);
            expect(getZodMetadata(childSchema._zod.def.shape.numberProperty)?.notes).toEqual(CHILD_NUMBER_PROPERTY_NOTES);
            expect(getZodMetadata(childSchema._zod.def.shape.arrayProperty.element)?.notes).toEqual(CHILD_ARRAY_PROPERTY_NOTES);
        });
    });
});
