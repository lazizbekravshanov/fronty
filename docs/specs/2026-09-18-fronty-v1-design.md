# fronty v1 design

Date: 2026-09-18
Status: approved direction, building

## What fronty is

A copy-paste React component library that brings old UI back to life with cool minimalism. Every component comes in era themes, from 1984 Mac to 2026 liquid glass. People run `npx fronty add button` and the source lands in their project, so they own it and can change anything. Lighter than shadcn: zero runtime dependencies besides React.

## Decisions

| Topic | Decision |
|---|---|
| Delivery | Copy-paste CLI. The only thing on npm is the `fronty` CLI, which carries the registry inside it (works offline, no server). |
| Stack | React 19, TypeScript, Tailwind CSS v4 friendly (Tailwind is optional). |
| Themes | One set of components, many themes. A theme is a CSS file keyed by `[data-theme="<name>"]` that styles components through `data-slot` hooks. |
| Eras | Vintage (1984 to 1999), Y2K (2000 to 2012), Now (2025+), Remix (old structure on new material). |
| Theme roadmap | v1: `now/liquid`. Then `y2k/aqua` (becomes the default once it ships), `vintage/platinum`, `remix/blend`. Later: `vintage/system`, `y2k/aero`. |
| v1 components | Button, TextField, Checkbox, Switch, Slider, Select, Tabs, Menu, Dialog, Popover, Tooltip, Toast, Card. |
| Behavior | Native platform first: `<dialog>`, the Popover API (top layer, light dismiss), native checkbox/range inputs. Small in-house hooks fill gaps (positioning, roving focus, typeahead). No Radix, no Floating UI. |
| Styling | Theme CSS lives in `@layer components`. User Tailwind classes land in `@layer utilities` and always win, so no tailwind-merge is needed. `cn()` just joins class names. |
| Figma | Figma owns tokens (variables) and icons. They export to `tokens/*.json` and `icons/svg/*.svg`, and scripts generate theme CSS variables and React icon components. Code Connect / a Figma component library comes after v1. |

## Repo layout

```
registry/                 source of everything users can add
  registry.json           manifest: items, files, deps between items
  lib/cn.ts
  hooks/                  use-anchor-position, use-roving-focus, use-controllable
  icons/                  generated from icons/svg
  ui/                     one file per component
  themes/base.css         shared resets + Tailwind bridge (@theme inline)
  themes/now/liquid.css   generated variable block + hand written slot styles
cli/                      the `fronty` bin (init, add, list)
tokens/liquid.json        exported from Figma variables
icons/svg/                exported from Figma icon components
scripts/                  build-tokens, build-icons
playground/               local showcase of every component on a wallpaper
tests/
```

The old Vite library build from the skeleton is removed; the package ships `dist/cli` plus `registry/`.

## CLI

- `npx fronty init`: writes `fronty.json` (`{ "dir": "src/components/fronty", "theme": "now/liquid" }`), copies `lib/cn.ts`, `themes/base.css` and the chosen theme.
- `npx fronty add <item...>`: resolves registry dependencies (for example `select` pulls `hooks/use-anchor-position` and `icons/chevron-down`), copies files keeping the `ui/ lib/ hooks/ icons/ themes/` structure so relative imports just work, and skips files that already exist unless `--overwrite`.
- `npx fronty list`: prints items grouped by kind.

The user imports the CSS once: `@import "./components/fronty/themes/base.css"; @import "./components/fronty/themes/now/liquid.css";` and sets `data-theme="liquid"` on `<html>` or any subtree (themes can nest).

## Theme contract

Every component part has `data-slot="<component>-<part>"` and state as data attributes (`data-state`, `data-disabled`, `data-variant`, `data-size`). Themes only target those. Tokens are CSS variables prefixed `--fy-`:

- color: `bg`, `fg`, `fg-muted`, `accent`, `accent-fg`, `danger`, `success`, `warning`, `border`
- glass: `glass-tint`, `glass-tint-strong`, `glass-blur`, `glass-saturate`, `glass-highlight`, `glass-edge`, `glass-shadow`
- shape: `radius-sm`, `radius-md`, `radius-lg`, `radius-full`
- space: `space-1` to `space-8`
- type: `font-sans`, `font-mono`, `text-xs` to `text-lg`
- motion: `ease`, `duration-fast`, `duration`

Light and dark both ship; dark follows `prefers-color-scheme` unless `data-mode="light|dark"` is set.

## Component notes

- **Button**: variants `primary | secondary | ghost | danger`, sizes `sm | md | lg`. Native `<button>`, `type="button"` by default.
- **TextField**: label, description, error, optional leading icon; wires `aria-describedby` and `aria-invalid`.
- **Checkbox**: native input (supports `indeterminate`), custom visual.
- **Switch**: native checkbox with `role="switch"`.
- **Slider**: native range input, fill via a `--fy-slider-fill` custom property.
- **Select**: button + listbox in a popover. Keyboard: arrows, Home/End, typeahead, Enter/Space, Escape. Hidden input for forms. Controlled or uncontrolled.
- **Tabs**: segmented control style; roving focus, arrows move and activate.
- **Menu**: trigger + popover menu, `menuitem` roles, roving focus, typeahead, closes on select. Context menu variant opens at the pointer.
- **Dialog**: native `<dialog>` with `showModal()`; Escape and backdrop click close; returns focus.
- **Popover**: Popover API, positioned by `useAnchorPosition` (flip + shift inside viewport).
- **Tooltip**: `popover="hint"` when supported, else `manual`; opens on hover/focus after a delay.
- **Toast**: `toast()` function plus `<Toaster />` region (`aria-live="polite"`), auto dismiss, pause on hover.
- **Card**: the glass surface, with header, title, description, body, footer parts.

## Icons (v1)

check, chevron-down, chevron-up, chevron-right, close, plus, minus, search, more, info, success, warning, error, dot. 16px grid, 1.5px strokes, round caps, `currentColor`.

## Testing

Vitest + Testing Library in jsdom for behavior and a11y wiring of every component; unit tests for the CLI (dependency resolution, copying, skip/overwrite) and the token/icon generators. jsdom lacks the Popover API and `showModal`, so tests stub those. Visual check in the playground in a real browser.

## Out of scope for v1

Other themes, Code Connect, a docs website, RTL polish, form library integrations.
