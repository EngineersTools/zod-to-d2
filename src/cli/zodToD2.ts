import { $ZodObject, $ZodType } from "zod/v4/core";
import { buildDiagram } from "../builder/buildDiagram.js";
import { buildRelationship } from "../builder/buildRelationship.js";
import { buildTable } from "../builder/buildTable.js";
import { loadZodSchemas } from "../loader/loadZodSchemas.js";
import { scanDirectory } from "../loader/scanDirectory.js";
import { parseProperties } from "../parser/parseProperties.js";
import { parseRelationships } from "../parser/parseRelationships.js";
import { getZodMetadata } from "../utils/zodMetadataRegistry.js";
import {
  isLoadedZodSchemaError,
  isLoadedZodSchemaSuccess,
} from "../types/LoadedZodSchema.type.js";
import { type ZodToD2Config } from "../types/ZodToD2Config.type.js";
import { saveToFile } from "./saveToFile.js";

export async function zodToD2(config: ZodToD2Config): Promise<void> {
  let filePaths: string[] = [];
  let title: string | undefined;

  console.log("Starting D2 Diagram generation...");

  if (config.source === "directory") {
    filePaths = await scanDirectory(config.directory);
    console.log(`Scanning directory: ${config.directory}`);
    if (filePaths.length === 0) {
      console.warn("No Zod schema files found in the specified directory.");
      return;
    }
    console.log(`Found ${filePaths.length} schema files.`);
  } else if (config.source === "filePaths") {
    filePaths = config.filePaths;
  } else {
    throw new Error("Invalid configuration provided to zodToD2");
  }

  title = config.title ?? "Generated Diagram";

  const loadedSchemas = await Promise.all(
    filePaths.map((filePath) => loadZodSchemas(filePath))
  );
  const successfulSchemas = loadedSchemas
    .flat()
    .filter(isLoadedZodSchemaSuccess);

  const errorSchemas = loadedSchemas.flat().filter(isLoadedZodSchemaError);

  console.log(
    `${errorSchemas.length} errors encountered while loading schemas:`
  );
  errorSchemas.forEach((errorSchema) => {
    console.error(
      `Error in file ${errorSchema.filePath}: ${errorSchema.errorMessage}`
    );
    console.error(`Error details: ${errorSchema.error.message}`);
  });

  const diagramElements = new Array<string>();

  successfulSchemas.forEach((s) => {
    console.log(`Processing schema: ${s.key || "Unnamed Schema"}...`);
    
    const tableName =
      getZodMetadata(s.schema as $ZodObject)?.tableName || s.key || "unknown_table";

    const properties = parseProperties(s.schema as $ZodType, tableName);
    const relationships = parseRelationships(s.schema as $ZodType, tableName);

    diagramElements.push(buildTable(properties, tableName));
    diagramElements.push(...relationships.map(buildRelationship));
  });

  const fileContent = buildDiagram(
    title ?? "Generated Diagram",
    diagramElements
  );

  await saveToFile(config.outputPath || "./diagram.d2", fileContent);

  console.log("D2 Diagram generation complete.");
}
