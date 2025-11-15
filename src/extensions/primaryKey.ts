import * as z4 from "zod/v4/core";
import { ZodPrimaryKeyDef } from "../types/ZodPrimaryKeyDef.js";
import { getZodMetadata, setZodMetadata } from "../utils/zodMetadataRegistry.js";

export function primaryKey<T extends z4.$ZodType>(this: T): T {
  if (this._zod.def.type === "optional" || this._zod.def.type === "nullable") {
    throw new Error(`Primary key in cannot be optional or nullable.`);
  }

  const currentMetadata = getZodMetadata(this);

  if (currentMetadata?.primaryKey) {
    throw new Error("Primary key already defined for this schema.");
  }

  setZodMetadata(this, {
    ...currentMetadata,
    primaryKey: {
      type: "ZodPrimaryKey",
    } as ZodPrimaryKeyDef,
  });

  return this;
}
