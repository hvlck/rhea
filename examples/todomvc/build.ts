require("esbuild")
    .build({
        entryPoints: ["./examples/todomvc/index.ts"],
        bundle: true,
        outfile: "./dist/examples/todomvc/index.js",
        sourcemap: false,
        keepNames: true,
        minify: true,
        watch: true,
        target: ["chrome60", "firefox58"],
    })
    .catch(() => process.exit(1));
