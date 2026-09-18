import type { APIRoute } from "astro";
import { components } from "../data/components";

// A plain text map of fronty for AI coding tools (https://llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const base = site ? site.href.replace(/\/$/, "") : "";
  const body = `# fronty

> Copy-paste React 19 components with era themes (Y2K "aqua" gel, default; Now "liquid" glass). Built on native <dialog>, the Popover API and real inputs. Zero runtime dependencies besides React. Tailwind optional. Web only.

## Install

- \`npx fronty init\` (writes fronty.json, copies helpers and theme CSS; \`--theme liquid\` for liquid glass)
- \`npx fronty add <name...>\` copies source into src/components/fronty (ui/, hooks/, lib/, icons/, themes/) and pulls dependencies
- Import once: themes/base.css and themes/y2k/aqua.css (or themes/now/liquid.css); set <html data-theme="aqua">
- Imports look like: import { Button } from "@/components/fronty/ui/button"

## Components

${components.map((c) => `- [${c.name}](${base}/docs/components/${c.slug}): ${c.description} Add with \`npx fronty add ${c.add}\`.`).join("\n")}

## Theming

- [Theming](${base}/docs/theming): CSS variables --fy-*, data-slot hooks, data-mode="light|dark", styles in @layer components so user classes win.
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
