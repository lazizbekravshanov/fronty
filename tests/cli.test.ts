import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { add, init } from "../cli/commands";
import { collectFiles, listItems, localImports, resolveItem } from "../cli/registry";

const root = join(import.meta.dirname, "../registry");
const tmp = () => mkdtempSync(join(tmpdir(), "fronty-"));

describe("registry", () => {
  it("resolves names to files", () => {
    expect(resolveItem(root, "button")).toBe("ui/button.tsx");
    expect(resolveItem(root, "liquid")).toBe("themes/now/liquid.css");
    expect(resolveItem(root, "check")).toBe("icons/check.tsx");
    expect(resolveItem(root, "use-popover")).toBe("hooks/use-popover.ts");
    expect(() => resolveItem(root, "nope")).toThrow(/Unknown item/);
  });

  it("finds TS imports and CSS @imports", () => {
    expect(localImports(`import { a } from "../lib/cn";\nimport "./x.css";\nimport React from "react";`)).toEqual([
      "../lib/cn",
      "./x.css",
    ]);
    expect(localImports(`@import "./liquid.tokens.css";`)).toEqual(["./liquid.tokens.css"]);
  });

  it("pulls dependencies transitively", () => {
    const files = collectFiles(root, ["ui/select.tsx"]);
    expect(files).toEqual(
      expect.arrayContaining([
        "ui/select.tsx",
        "lib/cn.ts",
        "hooks/use-popover.ts",
        "hooks/use-anchor-position.ts",
        "hooks/use-list-navigation.ts",
        "icons/chevron-down.tsx",
        "icons/check.tsx",
      ]),
    );
    expect(collectFiles(root, ["themes/now/liquid.css"])).toContain("themes/now/liquid.tokens.css");
  });

  it("every registry file only imports things inside the registry", () => {
    const all = Object.entries(listItems(root)).flatMap(([kind, items]) => items.map((i) => resolveItem(root, `${kind}/${i}`)));
    expect(all.length).toBeGreaterThan(30);
    expect(() => collectFiles(root, all)).not.toThrow();
  });
});

describe("commands", () => {
  it("init writes config and the base files", () => {
    const cwd = tmp();
    const r = init(root, cwd);
    expect(JSON.parse(readFileSync(join(cwd, "fronty.json"), "utf8"))).toEqual({ dir: "src/components/fronty", theme: "liquid" });
    for (const f of ["lib/cn.ts", "themes/base.css", "themes/now/liquid.css", "themes/now/liquid.tokens.css"]) {
      expect(existsSync(join(cwd, "src/components/fronty", f))).toBe(true);
    }
    expect(r.written).toHaveLength(5);
  });

  it("add refuses to run before init", () => {
    expect(() => add(root, tmp(), ["button"])).toThrow(/fronty init/);
  });

  it("add copies deps, keeps edited files, and --overwrite only touches what was asked for", () => {
    const cwd = tmp();
    init(root, cwd, { dir: "ui-kit" });
    add(root, cwd, ["checkbox"]);
    expect(readdirSync(join(cwd, "ui-kit/icons")).sort()).toEqual(["check.tsx", "minus.tsx"]);

    writeFileSync(join(cwd, "ui-kit/ui/checkbox.tsx"), "// mine");
    writeFileSync(join(cwd, "ui-kit/lib/cn.ts"), "// my cn");

    const again = add(root, cwd, ["checkbox"]);
    expect(again.skipped).toEqual(["ui-kit/ui/checkbox.tsx"]);
    expect(again.reused).toContain("ui-kit/lib/cn.ts");
    expect(readFileSync(join(cwd, "ui-kit/ui/checkbox.tsx"), "utf8")).toBe("// mine");

    add(root, cwd, ["checkbox"], { overwrite: true });
    expect(readFileSync(join(cwd, "ui-kit/ui/checkbox.tsx"), "utf8")).not.toBe("// mine");
    expect(readFileSync(join(cwd, "ui-kit/lib/cn.ts"), "utf8")).toBe("// my cn");
  });
});
