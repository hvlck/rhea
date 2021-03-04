require("esbuild")
    .build({
        entryPoints: ["./src/index.ts"],
        bundle: true,
        outfile: "dist/index.js",
        minify: true,
        sourcemap: true,
        keepNames: true,
    })
    .catch(() => process.exit(1));
