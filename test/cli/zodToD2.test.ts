import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { zodToD2 } from "../../src/cli/zodToD2";
import { loadZodSchemas } from "../../src/loader/loadZodSchemas";
import { parseProperties } from "../../src/parser/parseProperties";
import { parseRelationships } from "../../src/parser/parseRelationships";
import { buildTable } from "../../src/builder/buildTable";
import { buildRelationship } from "../../src/builder/buildRelationship";
import { buildDiagram } from "../../src/builder/buildDiagram";
import { saveToFile } from "../../src/cli/saveToFile";

vi.mock("../../src/loader/loadZodSchemas", () => ({
  loadZodSchemas: vi.fn(),
}));

vi.mock("../../src/parser/parseProperties", () => ({
  parseProperties: vi.fn(),
}));

vi.mock("../../src/parser/parseRelationships", () => ({
  parseRelationships: vi.fn(),
}));

vi.mock("../../src/builder/buildTable", () => ({
  buildTable: vi.fn(),
}));

vi.mock("../../src/builder/buildRelationship", () => ({
  buildRelationship: vi.fn(),
}));

vi.mock("../../src/builder/buildDiagram", () => ({
  buildDiagram: vi.fn(),
}));

vi.mock("../../src/cli/saveToFile", () => ({
  saveToFile: vi.fn(),
}));

describe("ZodToD2 Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should generate D2 file from single input file", async () => {
    vi.mocked(loadZodSchemas).mockResolvedValue([
      {
        type: "LoadedZodSchemaSuccess",
        key: "schemaWithoutRelationships",
        schema: z.object({}),
      },
    ]);
    vi.mocked(parseProperties).mockReturnValue([] as any);
    vi.mocked(parseRelationships).mockReturnValue([] as any);
    vi.mocked(buildTable).mockReturnValue("TABLE");
    vi.mocked(buildDiagram).mockReturnValue("diagram");
    vi.mocked(saveToFile).mockResolvedValue();

    await zodToD2({
      title: "Test Diagram",
      outputPath: "./test-diagram.d2",
      source: "filePaths",
      filePaths: ["./test/schema.fixtures.ts"],
    });

    expect(saveToFile).toHaveBeenCalledWith("./test-diagram.d2", "diagram");
  });

  it("should parse relationships and map them via buildRelationship", async () => {
    const schema = z.object({});
    vi.mocked(loadZodSchemas).mockResolvedValue([
      {
        type: "LoadedZodSchemaSuccess",
        key: "child_table",
        schema,
      },
    ]);

    vi.mocked(parseProperties).mockReturnValue([] as any);

    const relationships = [
      {
        localProperty: "child_table.parentOneId",
        foreignEntity: "parent_one_table",
        foreignEntityProperty: "id",
      },
      {
        localProperty: "child_table.parentTwoId",
        foreignEntity: "parent_two_table",
        foreignEntityProperty: "id",
      },
    ];
    vi.mocked(parseRelationships).mockReturnValue(relationships as any);

    vi.mocked(buildTable).mockReturnValue("TABLE:child_table");
    vi.mocked(buildRelationship).mockImplementation((relationship) =>
      `REL:${relationship.localProperty}`
    );

    const diagramElements: string[] = [];
    vi.mocked(buildDiagram).mockImplementation((_title, elements) => {
      diagramElements.push(...elements);
      return "diagram-with-relationships";
    });

    vi.mocked(saveToFile).mockResolvedValue();

    await zodToD2({
      title: "Relationships Diagram",
      outputPath: "./relationships.d2",
      source: "filePaths",
      filePaths: ["./test/schema.fixtures.ts"],
    });

    expect(parseRelationships).toHaveBeenCalledWith(schema, "child_table");
    expect(buildRelationship).toHaveBeenCalledTimes(relationships.length);
    expect(diagramElements).toEqual([
      "TABLE:child_table",
      "REL:child_table.parentOneId",
      "REL:child_table.parentTwoId",
    ]);
    expect(saveToFile).toHaveBeenCalledWith(
      "./relationships.d2",
      "diagram-with-relationships"
    );
  });
});
