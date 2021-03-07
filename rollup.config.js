import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

import { version } from "./package.json";
const banner = `// rhea-${version}`;

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/rhea.es2017.js",
                format: "es",
                sourcemap: true,
                banner,
            },
        ],
        plugins: [resolve(), typescript()],
        watch: {
            include: "src/**",
        },
    },
    /*
    {
        input: "tests/index.test.ts",
        output: [
            {
                name: "unit_tests",
                file: "tests/dist/index.js",
                format: "iife",
                sourcemap: true,
            },
        ],
        plugins: [resolve(), typescript()],
        watch: {
            include: "src/tests/**",
        },
    },
    */
];
