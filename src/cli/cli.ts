#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import process from "node:process";
import path from "path";
import fs from "node:fs";
import url from "node:url";
import type { ZodToD2Config } from "../types/ZodToD2Config.type.js";
import { ensureDirectoryExists } from "../utils/ensureDirectoryExists.js";
import { zodToD2 } from "./zodToD2.js";

// Read version from package.json so the CLI stays in sync with the package
// Prefer the generated VERSION at build time. If missing (for local dev without running the
// generator), fall back to reading package.json at runtime.
let CLI_VERSION = "0.0.0";
try {
  // Attempt to import generated version (TypeScript source will be compiled to dist)
  // Use require-like dynamic handling because ts-node or tests may run without build step
  // Importing the TS file directly via import will be done by the compiler in production.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // Try require first (works in node when transpiled to JS)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const generated = require("../generated/version");
  CLI_VERSION = generated?.VERSION ?? CLI_VERSION;
} catch (err) {
  // Fallback: read package.json synchronously
  try {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const pkgPath = path.resolve(__dirname, "../../package.json");
    const pkgRaw = fs.readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(pkgRaw) as { version?: string };
    CLI_VERSION = pkg.version ?? CLI_VERSION;
  } catch (e) {
    // final fallback already set
  }
}

program
  .name("zod2d2")
  .description("CLI tool to convert Zod schemas to D2 diagrams")
  .version(CLI_VERSION)
  .helpOption("-h, --help", chalk.blue("Display help for command"));

program
  .option(
    "-d, --directory <path>",
    chalk.blue("Path to a directory containing Zod schema files.")
  )
  .option(
    "-f, --file-paths <paths...>",
    chalk.blue("A list of specific file paths to parse.")
  )
  .option(
    "-o, --output-path <path>",
    chalk.blue(
      'The path where the D2 file will be written. Defaults to "diagram.d2".'
    )
  )
  .option(
    "-t, --title <string>",
    chalk.blue(
      'A title to add to the top of the D2 diagram. Defaults to "Generated Diagram".'
    )
  );

program.action(async (options) => {
  const { directory, filePaths, outputPath, title } = options;

  // Enforce the OneOf/XOR relationship between 'directory' and 'filePaths'
  if (!directory && !filePaths) {
    console.error(
      chalk.red(
        "❌ Error: You must specify either --directory OR --file-paths."
      )
    );
    program.help();
  } else if (directory && filePaths) {
    console.error(
      chalk.red(
        "❌ Error: You must specify either --directory OR --file-paths, but not both."
      )
    );
    program.help();
  }

  let config = {
    outputPath: outputPath || "diagram.d2",
    title: title || "Generated Diagram",
  } as ZodToD2Config;

  if (directory) {
    config = {
      ...config,
      source: "directory",
      directory: path.resolve(process.cwd(), directory),
    } as ZodToD2Config;
  } else {
    config = {
      ...config,
      source: "filePaths",
      filePaths: filePaths.map((p: string) => path.resolve(process.cwd(), p)),
    } as ZodToD2Config;
  }

  try {
    await ensureDirectoryExists(config.outputPath as string);

    console.log("Generating D2 diagram...");
    await zodToD2(config);
    console.log(
      chalk.green(`✅ Success! Diagram written to ${config.outputPath}`)
    );
  } catch (error) {
    console.error(chalk.red("❌ An error occurred during diagram generation:"));
    console.error(chalk.red(error));
    process.exit(1);
  }
});

program.parse(process.argv);
