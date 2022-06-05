# Bundling

My preferred bundler is [esbuild](https://github.com/evanw/esbuild/).

I've found the following setup to be rather headache-free:

Run `yarn add -D esbuild` to add `esbuild` as a dev dependency.

Create a file `build.ts`:

```typescript
// build.ts
require("esbuild")
    .build({
        entryPoints: ["./src/index.tsx"],
        bundle: true,
        outfile: "dist/index.js",
        minify: true,
        sourcemap: true,
        treeShaking: true,
        watch: true,
        keepNames: false,
    })
    .catch(() => process.exit(1));
```

And then run it with `node ./build.ts` (which you can set as a `script` in your `package.json`)
