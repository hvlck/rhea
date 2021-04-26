require("esbuild")
    .build({
        entryPoints: ["./src/index.tsx"],
        bundle: true,
        outfile: "dist/index.js",
        sourcemap: false,
        keepNames: true,
        minify: true,
        target: ["chrome58", "firefox57", "safari11", "edge16"],
    })
    .catch(() => process.exit(1));
