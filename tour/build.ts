require("esbuild")
    .build({
        entryPoints: ["./src/components.ts"],
        bundle: true,
        outfile: "dist/index.js",
        minify: true,
        sourcemap: true,
        treeShaking: true,
        watch: true,
        keepNames: true,
        target: "es2020",
        format: "esm",
    })
    .catch(() => process.exit(1));

require("esbuild")
    .build({
        entryPoints: ["./src/index.css"],
        bundle: true,
        outfile: "dist/index.css",
        minify: true,
        sourcemap: true,
        treeShaking: true,
        watch: true,
        keepNames: true,
    })
    .catch(() => process.exit(1));
