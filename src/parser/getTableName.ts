import * as z4 from "zod/v4/core";
import { getZodMetadata } from "../utils/zodMetadataRegistry.js";

export function getTableName(_schema: z4.$ZodType): string | undefined {
  const schema = _schema as z4.$ZodTypes;
  return getZodMetadata(schema)?.tableName;
}