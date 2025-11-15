import { bundleRequire } from "bundle-require";
import z3 from "zod/v3";
import * as z4 from "zod/v4/core";
import { type LoadedZodSchema } from "../types/LoadedZodSchema.type.js";

export async function loadZodSchemas(
  filePath: string
): Promise<LoadedZodSchema[]> {
  try {
    const br = await bundleRequire({
      filepath: filePath,
      format: "esm",
      esbuildOptions: {
        external: ["zod", "zod/*"],
      },
    });

    return Object.entries(br.mod)
      .filter(
        ([_key, schema]) =>
          schema instanceof z4.$ZodType || schema instanceof z3.ZodType
      )
      .map(
        ([key, schema]) =>
          ({
            type: "LoadedZodSchemaSuccess",
            key,
            schema,
          } as LoadedZodSchema)
      );
  } catch (error) {
    return [
      {
        type: "LoadedZodSchemaError",
        errorMessage: `Failed to load Zod schemas from file: ${filePath}`,
        error: error instanceof Error ? error : new Error(String(error)),
        filePath,
      } as LoadedZodSchema,
    ];
  }
}
