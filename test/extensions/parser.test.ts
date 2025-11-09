import { describe, expect, it } from "vitest";
import { childSchema, parentOneSchema, schemaWithoutMetadata } from "../schema.fixtures";

describe("Parser Extension Methods", () => {
  describe("parseProperties", () => {
    it("should parse properties from a schema with metadata", () => {
      const properties = parentOneSchema.parseProperties();
      
      expect(properties).toBeDefined();
      expect(properties).toHaveLength(3); // id, name, description
      
      const [idProp] = properties;
      expect(idProp.name).toBe("parent_one_table.id");
      expect(idProp.type).toBe("string");
      expect(idProp.isPrimaryKey).toBe(true);
    });

    it("should parse complex properties from child schema", () => {
      const properties = childSchema.parseProperties();
      
      expect(properties).toBeDefined();
      expect(properties.length).toBeGreaterThan(0);
      
      const parentOneIdProp = properties.find(p => p.name === "child_table.parentOneId");
      expect(parentOneIdProp).toBeDefined();
      expect(parentOneIdProp?.type).toBe("string");
      expect(parentOneIdProp?.isForeignKey).toBe(true);
    });

    it("should parse properties from schema without metadata", () => {
      const properties = schemaWithoutMetadata.parseProperties();
      
      expect(properties).toBeDefined();
      expect(properties.length).toBeGreaterThan(0);
      expect(properties.every(p => !p.isPrimaryKey && !p.isForeignKey)).toBe(true);
    });
  });

  describe("parseRelationships", () => {
    it("should parse relationships from child schema", () => {
      const relationships = childSchema.parseRelationships();
      
      expect(relationships).toBeDefined();
      expect(relationships).toHaveLength(2); // parentOneId -> parentOne.id, parentTwoId -> parentTwo.id
      
      const parentOneRel = relationships.find(r => r.localProperty === "child_table.parentOneId");
      expect(parentOneRel).toBeDefined();
      expect(parentOneRel?.foreignEntityProperty).toBe("id");
      expect(parentOneRel?.foreignEntity).toBe("parent_one_table");
    });

    it("should return empty array for schema without relationships", () => {
      const relationships = parentOneSchema.parseRelationships();
      
      expect(relationships).toBeDefined();
      expect(relationships).toHaveLength(0);
    });

    it("should return empty array for schema without metadata", () => {
      const relationships = schemaWithoutMetadata.parseRelationships();
      
      expect(relationships).toBeDefined();
      expect(relationships).toHaveLength(0);
    });
  });
});