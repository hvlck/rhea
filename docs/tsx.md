# TSX

TSX is supported in Rhea. Make sure you specify these fields in your `tsconfig.json`:

```json
"jsx": "react"
"jsxFactory": "Rhea.build",
```

and import

```typescript
import * as Rhea from "../src/std/index";
```

in your `*.tsx` files.

[See the example here for more](../examples/jsx.tsx).
