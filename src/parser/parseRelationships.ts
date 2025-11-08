import * as z4 from "zod/v4/core";
import { type PropertyRelationship } from "../types/PropertyRelationship.type.js";
import { ZodForeignKeyDef } from "../types/ZodForeignKeyDef.js";
import { getObjectProperties } from "./getObjectProperties.js";
import { isForeignKey } from "./isForeignKey.js";

export function parseRelationships(
  _schema: z4.$ZodType,
  propertyName: string = "root"
): PropertyRelationship[] {
  const relationships = new Array<PropertyRelationship>();
  const schema = _schema as z4.$ZodTypes;
  const def = schema._zod.def;
  const isForeign = isForeignKey(schema);

  switch (def.type) {
    case "object": {
      // determine table name: prefer registry value, otherwise use propertyName
      let tableName = (z4.globalRegistry.get(schema)?.tableName as string) ||
        (propertyName !== "root" ? propertyName : "unknown_table");
      const objectProperties = getObjectProperties(schema as z4.$ZodObject);
      relationships.push(
        ...objectProperties.flatMap((prop) =>
          parseRelationships(prop[1], `${tableName}.${prop[0]}`)
        )
      );
      break;
    }

    default: {
      if (isForeign) {
        const foreignKey = z4.globalRegistry.get(schema)
          ?.foreignKey as ZodForeignKeyDef;
        const foreignEntity = z4.globalRegistry.get(
          foreignKey.foreignSchema
        )?.tableName;

        relationships.push({
          localProperty: propertyName,
          foreignEntity: foreignEntity || "unknown_table",
          foreignEntityProperty: foreignKey.foreignProperty,
        } as PropertyRelationship);
      }
      break;
    }
  }

  return relationships;
}
