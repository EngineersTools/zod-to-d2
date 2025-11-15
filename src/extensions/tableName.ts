import * as z4 from "zod/v4/core";
import { getZodMetadata, setZodMetadata } from "../utils/zodMetadataRegistry.js";

export function tableName<T extends z4.$ZodObject>(this: T, name: string): T {
    const currentMetadata = getZodMetadata(this);

    setZodMetadata(this, {
        ...currentMetadata,
        tableName: name,
    });

    return this;
}