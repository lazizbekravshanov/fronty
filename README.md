# fronty

Old UI, brought back to life with cool minimalism.

fronty is a copy-paste React component library for the web with **era themes**. You run one command, the component's source lands in your project, and it's yours to change. No runtime dependencies besides React: menus, dialogs, popovers and tooltips are built on the browser's own `<dialog>` and Popover API.

| Era | Themes | Status |
|---|---|---|
| **Now** (2025+) | `liquid` (liquid glass) | ✅ v1 |
| **Y2K** (2000 to 2012) | `aqua`, `aero` | next |
| **Vintage** (1984 to 1999) | `platinum`, `system` | planned |
| **Remix** | `blend` (old structure, new glass) | planned |

## Quick start

```bash
npx fronty init             # writes fronty.json, copies cn + theme css
npx fronty add button card dialog
npx fronty list             # everything you can add
```

Then import the styles once and pick a theme:

```css
@import "./components/fronty/themes/base.css";
@import "./components/fronty/themes/now/liquid.css";
/* Tailwind v4? also: @import "./components/fronty/themes/tailwind.css"; */
```

```html
<html data-theme="liquid">          <!-- follows the OS light/dark -->
<html data-theme="liquid" data-mode="dark">
```

```tsx
import { Button } from "@/components/fronty/ui/button";

<Button variant="primary">Save</Button>
```

## Components (v1)

Button · TextField · Checkbox · Switch · Slider · Select · Tabs · Menu · Dialog · Popover · Tooltip · Toast · Card, plus 14 icons.

## Customizing

- **Edit the file.** It's in your repo now.
- **Override with classes.** Theme styles live in `@layer components`, so any class you pass (Tailwind or your own) wins. No tailwind-merge needed.
- **Target slots.** Every part has a `data-slot` (`select-trigger`, `menu-item`, `dialog-panel`…) and state attributes (`data-state`, `data-variant`, `data-size`), so you can restyle from CSS.
- **Change tokens.** Colors, glass, radius and spacing are CSS variables (`--fy-accent`, `--fy-glass-blur`…).

## Design source: Figma

Tokens and icons are designed in the [fronty Figma file](https://www.figma.com/design/8SPBcOobbk0U7U0uV01I2C) (variable collection `liquid`, page `Icons`) and generated into code:

1. Pull with `scripts/figma/export.js` (via the Figma MCP or a plugin console) into `tokens/*.json` and `icons/svg/*.svg`.
2. `npm run tokens` → `registry/themes/<era>/<theme>.tokens.css`
3. `npm run icons` → `registry/icons/*.tsx`

## Develop

```bash
npm install
npm run dev        # playground with every component, http://localhost:5173
npm test           # vitest: components, CLI, generators
npm run typecheck
npm run build      # builds the CLI into dist/cli
```

```
registry/   what users can add: ui/, hooks/, lib/, icons/, themes/
cli/        the fronty command (init, add, list)
tokens/     design tokens pulled from Figma
icons/svg/  icons pulled from Figma
scripts/    token + icon generators, Figma export script
playground/ local showcase, not shipped
docs/specs/ design decisions
```

## License

MIT
