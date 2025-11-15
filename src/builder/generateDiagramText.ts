import * as z4 from "zod/v4/core";
import { parseProperties } from "../parser/parseProperties.js";
import { parseRelationships } from "../parser/parseRelationships.js";
import { getZodMetadata } from "../utils/zodMetadataRegistry.js";
import { buildDiagram } from "./buildDiagram.js";
import { buildRelationship } from "./buildRelationship.js";
import { buildTable } from "./buildTable.js";

export function generateDiagramText(
  title: string,
  schemas: z4.$ZodObject[]
): string {
  const diagramElements = new Array<string>();

  schemas.forEach((s) => {
    const tableName = getZodMetadata(s)?.tableName || "unknown_table";
    const properties = parseProperties(s as z4.$ZodType, tableName);
    const relationships = parseRelationships(s as z4.$ZodType, tableName);

    diagramElements.push(buildTable(properties, tableName));
    diagramElements.push(...relationships.map(buildRelationship));
  });

  const diagram = buildDiagram(title ?? "Generated Diagram", diagramElements);

  return diagram;
}
