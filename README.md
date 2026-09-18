# fronty

A cool library of old school.

> Early days. The skeleton is here, components are coming.

## Develop

```bash
npm install
npm run dev        # playground at localhost:5173
npm test           # unit tests (vitest)
npm run typecheck
npm run build      # outputs dist/fronty.js, dist/fronty.css, types
```

## Layout

```
src/
  index.ts          public entry, everything exported from here
  styles/tokens.css design tokens (colors, spacing, type) as CSS vars
  components/       one folder per component
  utils/            small shared helpers
playground/         local sandbox, not shipped
tests/
```

## Use

```ts
import "fronty/styles.css";
import { cx } from "fronty";
```

## License

MIT
