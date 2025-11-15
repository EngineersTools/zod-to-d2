import * as z4 from "zod/v4/core";
import { mergeZodMetadata } from "../utils/zodMetadataRegistry.js";

export function notes<T extends z4.$ZodType>(this: T, ...notes: string[]): T {
  mergeZodMetadata(this, {
    notes,
  });

  return this;
}
