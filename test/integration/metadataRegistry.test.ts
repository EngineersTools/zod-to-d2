import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

/**
 * These tests ensure that metadata authored by user schemas (which may live in a separate
 * installation of the library) is visible to parser utilities that could come from a different
 * copy of the package, mimicking the CLI vs. project dependency scenario.
 */
describe("metadata registry integration", () => {
  it("shares metadata across isolated module instances", async () => {
    vi.resetModules();
    await import("../../src");

    const parentSchema = z
      .object({
        id: z.string().primaryKey(),
      })
      .tableName("parents");

    const childSchema = z
      .object({
        parentId: z.string().foreignKey(parentSchema, "id"),
      })
      .tableName("children");

    vi.resetModules();
    const { parseRelationships } = await import(
      "../../src/parser/parseRelationships"
    );

    const relationships = parseRelationships(childSchema, "children");

    expect(relationships).toEqual([
      {
        localProperty: "children.parentId",
        foreignEntity: "parents",
        foreignEntityProperty: "id",
      },
    ]);
  });
});
