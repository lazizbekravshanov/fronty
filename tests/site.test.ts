import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { components } from "../site/src/data/components";

const root = join(import.meta.dirname, "..");

describe("docs site", () => {
  it("documents every component in the registry, with a demo, and nothing extra", () => {
    const registry = readdirSync(join(root, "registry/ui")).map((f) => f.replace(/\.tsx$/, "")).sort();
    expect(components.map((c) => c.slug).sort()).toEqual(registry);
    for (const c of components) expect(existsSync(join(root, "site/src/components/demos", `${c.slug}.tsx`))).toBe(true);
  });
});
