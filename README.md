# zod-to-d2

[![CI](https://github.com/EngineersTools/zod-to-d2/actions/workflows/ci.yml/badge.svg)](https://github.com/EngineersTools/zod-to-d2/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/%40eng-tools%2Fzod-to-d2.svg?color=informational)](https://www.npmjs.com/package/@eng-tools/zod-to-d2)

`zod-to-d2` is a TypeScript library that extends the [Zod](https://github.com/colinhacks/zod) schema validation library, enabling you to annotate your schemas and automatically generate [D2](https://d2lang.com/) diagrams. This helps visualize data models, relationships, and schema structures directly from your Zod definitions.

## Features

- **Schema Annotation**: Add metadata (primary keys, foreign keys, notes, table names) to Zod schemas.
- **Automatic Diagram Generation**: Convert annotated Zod schemas into D2 diagrams.
- **Relationship Mapping**: Visualize foreign keys, primary keys, and other relationships.
- **Extensible**: Supports custom extensions for notes, table names, and more.
- **CLI Tool**: Generate diagrams from files or directories via command line.
- **TypeScript Support**: Fully typed for safe and predictable usage.

## Installation

```bash
pnpm add @eng-tools/zod-to-d2
# or
npm install @eng-tools/zod-to-d2
# or
yarn add @eng-tools/zod-to-d2
```

## Usage

1. **Annotate your Zod schemas**

[Sample schemas here](./test//sample.schemas.ts)

```ts
import { z } from "zod";
import "@eng-tools/zod-to-d2";

export const userSchema = z
  .object({
    id: z.string().primaryKey(), //<-- marks the 'id' property as a PK
    name: z.string().notes("The name of the user"), //<-- includes comments on this property on the output diagram
    email: z.string(),
  })
  .tableName("users"); //<-- give the table/entity a name

export const postSchema = z
  .object({
    id: z.string().primaryKey(),
    authorId: z.string().foreignKey(userSchema, "id"), //<- creates a FK relationship to the 'id' property of the 'userSchema'
    content: z.string(),
  })
  .tableName("posts"); //<-- give the table/entity a name
```

2. **Generate a D2 diagram (programmatic API)**

```ts
import { generateDiagramText } from "@eng-tools/zod-to-d2";

const diagram = generateDiagramText([userSchema, postSchema]);
console.log(diagram); // D2 diagram source
```

This outputs the following D2 text:

```d2
direction: down
title: |md Sample Diagram | {near: top-center}
users: {
  shape: sql_table
  "id": string {constraint: [primary_key]}
  "name": string # The name of the user
  "email": string
}

posts: {
  shape: sql_table
  "id": string {constraint: [primary_key]}
  "authorId": string {constraint: [foreign_key]}
  "content": string
}

posts.authorId <-> users.id: {
  source-arrowhead: {shape: cf-many}
  target-arrowhead: {shape: cf-one-required}
}
```

You can find how this looks on the [D2 Playground here](https://play.d2lang.com/?script=tI_BTsNADETv-xVWOacfsEKcuHCGG0KV2XUTi6ydeh1VVZp_R0GlEap6ZI878zwzmY2Ss0qErEcJzt5ThHPJ8Ipl6AmeGVvDAmeYQAgtguvQJBIngzmMlaxGmAJcXu1woAj10O8cP3u6ChvOmwjVjaWFKalUN2TxCO8wGBe00-6LTvAxr4hgoRV6gLeOYPkD3YN3BEv66qaC3F_tYQ5h0Or_1w5H79Re7oN7NeJWbsCk4iR-W3X7exIem6efdXXL-c8AHS1Rg2Z67AgX7bIp7ZuCclpjHK0lv2NVocboMLJRnsMcvgMAAP__&layout=elk&), or as shown in the image below.

!![Sample Diagram](./docs/images/Sample_Diagram.png)

3. **Generate a D2 diagram (CLI)**

```sh
> pnpm zod2d2 --file-paths src/schemas/user.ts src/schemas/post.ts --output-path diagram.d2 --title "My Diagram"
# or
> pnpm zod2d2 --directory src/schemas --output-path diagram.d2
```

## License

MIT

## Contributing

Contributions and suggestions are welcome! Please open issues or pull requests on GitHub.
