import * as z4 from "zod/v4/core";
import { isPrimaryKey } from "./isPrimaryKey.js";
import { getObjectProperties } from "./getObjectProperties.js";

export function getPrimaryKey(_schema: z4.$ZodType): { name: string; schema: z4.$ZodType } | undefined {
  const schema = _schema as z4.$ZodTypes;
  const def = schema._zod.def;

  if (def.type === "object") {
    const objectProperties = getObjectProperties(schema as z4.$ZodObject);
    for (const [name, propertySchema] of objectProperties) {
      if (isPrimaryKey(propertySchema)) {
        return { name, schema: propertySchema };
      }
    }
  }

  return undefined;
}