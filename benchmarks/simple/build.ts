require("esbuild")
    .build({
        entryPoints: ["./src/index.tsx"],
        bundle: true,
        outfile: "dist/index.js",
        sourcemap: false,
        keepNames: true,
        minify: true,
    })
    .catch(() => process.exit(1));
