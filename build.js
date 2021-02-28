require("esbuild")
    .build({
        entryPoints: ["./src/index.ts"],
        bundle: true,
        outfile: "dist/index.js",
    })
    .catch(() => process.exit(1));

require("esbuild")
    .build({
        entryPoints: ["./component.ts"],
        bundle: true,
        outfile: "dist/component.js",
    })
    .catch(() => process.exit(1));
