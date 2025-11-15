import * as z4 from "zod/v4/core";
import { getZodMetadata } from "../utils/zodMetadataRegistry.js";

export function isForeignKey<T extends z4.$ZodType>(schema: T) {
  return getZodMetadata(schema)?.foreignKey !== undefined;
}
