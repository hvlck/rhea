require("esbuild")
    .build({
        entryPoints: ["./src/index.tsx"],
        bundle: true,
        outfile: "dist/index.js",
        sourcemap: false,
        keepNames: true,
        target: "es2020",
    })
    .catch(() => process.exit(1));
