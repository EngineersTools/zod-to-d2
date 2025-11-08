import * as z from "zod";
import * as z3 from "zod/v3";
import * as z4 from "zod/v4/core";
import { foreignKey } from "./extensions/foreignKey.js";
import { notes } from "./extensions/notes.js";
import { primaryKey } from "./extensions/primaryKey.js";
import { tableName } from "./extensions/tableName.js";
import { type MatchingKeys } from "./types/MatchingKeys.type.js";

import * as parser from "./parser/index.js";
import * as builder from "./builder/index.js";
import * as loader from "./loader/index.js";

export * from "./parser/index.js";
export * from "./builder/index.js";
export * from "./loader/index.js";

// Provide a default aggregate export for consumers using default imports
const defaultExport = {
  ...parser,
  ...builder,
  ...loader,
};

export default defaultExport;

declare module "zod" {
  interface ZodObject {
    tableName(name: string): this;
  }

  interface ZodType {
    foreignKey<TThis extends z.ZodType, TForeign extends z.ZodObject>(
      this: TThis,
      foreignSchema: TForeign,
      foreignProperty: MatchingKeys<TForeign, TThis>
    ): TThis;

    primaryKey<TThis extends z.ZodType>(this: TThis): TThis;

    notes<TThis extends z.ZodType>(this: TThis, ...notes: string[]): TThis;
  }
}

const tableNameSymbol = Symbol.for("tableName");
const primaryKeySymbol = Symbol.for("primaryKey");
const foreignKeySymbol = Symbol.for("foreignKey");
const notesSymbol = Symbol.for("notes");

if (!(globalThis as { [k: symbol]: unknown })[tableNameSymbol]) {
  (globalThis as { [k: symbol]: unknown })[tableNameSymbol] = true;
  Object.defineProperty(z3.ZodObject.prototype, "tableName", {
    get: function (this) {
      return tableName.bind(this);
    },
  });
  z4.$ZodObject.prototype.tableName = tableName;
  z.ZodObject.prototype.tableName = tableName;
}

if (!(globalThis as { [k: symbol]: unknown })[primaryKeySymbol]) {
  (globalThis as { [k: symbol]: unknown })[primaryKeySymbol] = true;
  Object.defineProperty(z3.ZodType.prototype, "primaryKey", {
    get: function (this) {
      return primaryKey.bind(this);
    },
  });
  z4.$ZodType.prototype.primaryKey = primaryKey;
  z.ZodType.prototype.primaryKey = primaryKey;
  z.string.prototype.primaryKey = primaryKey;
}

if (!(globalThis as { [k: symbol]: unknown })[foreignKeySymbol]) {
  (globalThis as { [k: symbol]: unknown })[foreignKeySymbol] = true;
  Object.defineProperty(z3.ZodType.prototype, "foreignKey", {
    get: function (this) {
      return foreignKey.bind(this);
    },
  });
  z4.$ZodType.prototype.foreignKey = foreignKey;
  z.ZodType.prototype.foreignKey = foreignKey;
  z.string.prototype.foreignKey = foreignKey;
}

if (!(globalThis as { [k: symbol]: unknown })[notesSymbol]) {
  (globalThis as { [k: symbol]: unknown })[notesSymbol] = true;
  Object.defineProperty(z3.ZodType.prototype, "notes", {
    get: function (this) {
      return notes.bind(this);
    },
  });
  z4.$ZodType.prototype.notes = notes;
  z.ZodType.prototype.notes = notes;
  z.string.prototype.notes = notes;
}
