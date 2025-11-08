import { promises as fs } from "node:fs";
import * as path from "node:path";

export async function scanDirectory(directory: string): Promise<string[]> {
    try {
        const results: string[] = [];

        async function walk(dir: string) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            await Promise.all(
                entries.map(async (entry) => {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        await walk(fullPath);
                    } else if (entry.isFile()) {
                        results.push(fullPath);
                    }
                })
            );
        }

        await walk(directory);
        return results;
    } catch (error) {
        return [];
    }
}