import * as z4 from "zod/v4/core";

export function getTableName(_schema: z4.$ZodType): string | undefined {
  const schema = _schema as z4.$ZodTypes;
  const tableName = z4.globalRegistry.get(schema)?.tableName as string;
  return tableName;
}