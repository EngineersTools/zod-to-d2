import { $ZodType } from "zod/v4/core";
import { ZodForeignKeyDef } from "../types/ZodForeignKeyDef.js";
import { getZodMetadata } from "../utils/zodMetadataRegistry.js";

export function getForeignKeyFromMeta<
  T extends $ZodType & { meta?: () => any }
>(
  schema: T
): ZodForeignKeyDef | undefined {
  const meta = schema.meta?.();
  return getZodMetadata(schema)?.foreignKey ?? (meta?.foreignKey as
      | ZodForeignKeyDef
      | undefined);
}
