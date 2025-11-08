import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { scanDirectory } from "../../src/loader";

describe("scanDirectory unit tests", () => {
  it("recursively finds files in nested dirs", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "z2d2-"));
    try {
      const nested = path.join(tmp, "a", "b");
      await fs.mkdir(nested, { recursive: true });
      const f1 = path.join(tmp, "root.txt");
      const f2 = path.join(tmp, "a", "file1.txt");
      const f3 = path.join(tmp, "a", "b", "file2.txt");
      await fs.writeFile(f1, "x");
      await fs.writeFile(f2, "y");
      await fs.writeFile(f3, "z");

      const results = await scanDirectory(tmp);

      const expected = [f1, f2, f3].map((p) => path.resolve(p)).sort();
      const got = results.map((p) => path.resolve(p)).sort();

      expect(got).toEqual(expect.arrayContaining(expected));
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("returns empty array for nonexistent directory", async () => {
    const tmp = path.join(os.tmpdir(), "nonexistent-" + Date.now());
    const res = await scanDirectory(tmp);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(0);
  });

  it("returns empty array for empty directory", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "z2d2-"));
    try {
      const res = await scanDirectory(tmp);
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(0);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});
