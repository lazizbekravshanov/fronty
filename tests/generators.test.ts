import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { componentName, svgToTsx } from "../scripts/build-icons";
import { cssValue, cssVarName, tokensToCss, type TokenFile } from "../scripts/build-tokens";

describe("build-tokens", () => {
  it("names and units", () => {
    expect(cssVarName("color/fg-muted")).toBe("--fy-fg-muted");
    expect(cssVarName("glass/tint")).toBe("--fy-glass-tint");
    expect(cssVarName("motion/duration")).toBe("--fy-duration");
    expect(cssVarName("space/3")).toBe("--fy-space-3");
    expect(cssValue("radius/md", 12)).toBe("12px");
    expect(cssValue("glass/saturate", 180)).toBe("180%");
    expect(cssValue("motion/duration", 220)).toBe("220ms");
    expect(cssValue("font/sans", "Inter")).toMatch(/^"Inter", ui-sans-serif/);
  });

  it("emits light values plus dark overrides for both media query and data-mode", () => {
    const file: TokenFile = {
      collection: "demo",
      modes: ["light", "dark"],
      tokens: [
        { name: "color/bg", type: "COLOR", values: { light: "#FFFFFF", dark: "#000000" } },
        { name: "radius/sm", type: "FLOAT", values: { light: 8, dark: 8 } },
      ],
    };
    const css = tokensToCss(file);
    expect(css).toContain('[data-theme="demo"] {');
    expect(css).toContain("--fy-bg: #FFFFFF;");
    expect(css).toContain('[data-theme="demo"]:not([data-mode="light"])');
    expect(css).toContain('[data-theme="demo"][data-mode="dark"]');
    expect(css.match(/--fy-radius-sm/g)).toHaveLength(1);
  });

  it("the committed liquid css is up to date with tokens/liquid.json", () => {
    const root = join(import.meta.dirname, "..");
    const json = JSON.parse(readFileSync(join(root, "tokens/liquid.json"), "utf8"));
    expect(readFileSync(join(root, "registry/themes/now/liquid.tokens.css"), "utf8")).toBe(tokensToCss(json));
  });
});

describe("build-icons", () => {
  it("names components", () => {
    expect(componentName("chevron-down.svg")).toBe("ChevronDownIcon");
  });

  it("converts attributes and colors", () => {
    const tsx = svgToTsx(
      "x",
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M0 0" stroke="black" stroke-width="1.5" stroke-linecap="round"/>\n</svg>\n`,
    );
    expect(tsx).toContain('stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />');
    expect(tsx).toContain("export function XIcon(");
    expect(tsx).not.toContain("xmlns");
  });
});
