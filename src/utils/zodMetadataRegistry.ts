import type { ZodForeignKeyDef } from "../types/ZodForeignKeyDef.js";
import type { ZodPrimaryKeyDef } from "../types/ZodPrimaryKeyDef.js";

export type ZodMetadata = {
  tableName?: string;
  primaryKey?: ZodPrimaryKeyDef;
  foreignKey?: ZodForeignKeyDef<any>;
  notes?: string[];
};

type RegistryTarget = object;
type MetadataRegistry = WeakMap<RegistryTarget, ZodMetadata>;

const REGISTRY_SYMBOL = Symbol.for("@eng-tools/zod-to-d2/metadata-registry");

type GlobalWithRegistry = typeof globalThis & {
  [REGISTRY_SYMBOL]?: MetadataRegistry;
};

function getRegistry(): MetadataRegistry {
  const globalWithRegistry = globalThis as GlobalWithRegistry;

  if (!globalWithRegistry[REGISTRY_SYMBOL]) {
    globalWithRegistry[REGISTRY_SYMBOL] = new WeakMap();
  }

  return globalWithRegistry[REGISTRY_SYMBOL]!;
}

function asRegistryTarget(target: unknown): RegistryTarget {
  if (typeof target !== "object" || target === null) {
    throw new TypeError("Zod metadata can only be attached to object types");
  }

  return target as RegistryTarget;
}

export function getZodMetadata(target: unknown): ZodMetadata | undefined {
  return getRegistry().get(asRegistryTarget(target));
}

export function setZodMetadata(target: unknown, metadata: ZodMetadata): ZodMetadata {
  getRegistry().set(asRegistryTarget(target), metadata);
  return metadata;
}

export function upsertZodMetadata(
  target: unknown,
  updater: (current: ZodMetadata | undefined) => ZodMetadata
): ZodMetadata {
  const registry = getRegistry();
  const key = asRegistryTarget(target);
  const current = registry.get(key);
  const next = updater(current);
  registry.set(key, next);
  return next;
}

export function mergeZodMetadata(
  target: unknown,
  partial: Partial<ZodMetadata>
): ZodMetadata {
  return upsertZodMetadata(target, (current = {}) => {
    const next: ZodMetadata = {
      ...current,
      ...partial,
    };

    if (partial.notes) {
      next.notes = [...(current.notes ?? []), ...partial.notes];
    }

    return next;
  });
}

